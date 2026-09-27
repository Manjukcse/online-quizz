package com.example.exam.service.impl;

import com.example.exam.dto.OptionDTO;
import com.example.exam.dto.QuestionRequest;
import com.example.exam.dto.QuestionResponse;
import com.example.exam.entity.Exam;
import com.example.exam.entity.Option;
import com.example.exam.entity.Question;
import com.example.exam.entity.RoleName;
import com.example.exam.entity.User;
import com.example.exam.exception.BadRequestException;
import com.example.exam.exception.ForbiddenException;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.ExamRepository;
import com.example.exam.repository.QuestionRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId).stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        return mapToQuestionResponse(question);
    }

    @Override
    @Transactional
    public QuestionResponse addQuestionToExam(Long examId, QuestionRequest request, Long userId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        validateUserPermission(exam, userId);

        if (request.getOptions() == null || request.getOptions().size() < 2) {
            throw new BadRequestException("A question must have at least 2 options.");
        }

        boolean hasCorrectOption = request.getOptions().stream()
                .anyMatch(opt -> Boolean.TRUE.equals(opt.getIsCorrect()));
        if (!hasCorrectOption) {
            throw new BadRequestException("At least one option must be marked as correct.");
        }

        Question question = Question.builder()
                .exam(exam)
                .questionText(request.getQuestionText())
                .marks(request.getMarks())
                .explanation(request.getExplanation())
                .build();

        List<Option> options = new ArrayList<>();
        for (OptionDTO dto : request.getOptions()) {
            options.add(Option.builder()
                    .question(question)
                    .optionText(dto.getOptionText())
                    .isCorrect(Boolean.TRUE.equals(dto.getIsCorrect()))
                    .build());
        }

        question.setOptions(options);
        Question savedQuestion = questionRepository.save(question);

        return mapToQuestionResponse(savedQuestion);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long questionId, QuestionRequest request, Long userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        validateUserPermission(question.getExam(), userId);

        if (request.getOptions() == null || request.getOptions().size() < 2) {
            throw new BadRequestException("A question must have at least 2 options.");
        }

        boolean hasCorrectOption = request.getOptions().stream()
                .anyMatch(opt -> Boolean.TRUE.equals(opt.getIsCorrect()));
        if (!hasCorrectOption) {
            throw new BadRequestException("At least one option must be marked as correct.");
        }

        question.setQuestionText(request.getQuestionText());
        question.setMarks(request.getMarks());
        question.setExplanation(request.getExplanation());

        question.getOptions().clear();
        for (OptionDTO dto : request.getOptions()) {
            question.getOptions().add(Option.builder()
                    .question(question)
                    .optionText(dto.getOptionText())
                    .isCorrect(Boolean.TRUE.equals(dto.getIsCorrect()))
                    .build());
        }

        Question updatedQuestion = questionRepository.save(question);
        return mapToQuestionResponse(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long questionId, Long userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        validateUserPermission(question.getExam(), userId);
        questionRepository.delete(question);
    }

    private void validateUserPermission(Exam exam, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (!isAdmin && !exam.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to modify questions for this exam.");
        }
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        List<OptionDTO> optionDTOs = question.getOptions().stream()
                .map(opt -> OptionDTO.builder()
                        .id(opt.getId())
                        .optionText(opt.getOptionText())
                        .isCorrect(opt.getIsCorrect())
                        .build())
                .collect(Collectors.toList());

        return QuestionResponse.builder()
                .id(question.getId())
                .examId(question.getExam().getId())
                .questionText(question.getQuestionText())
                .marks(question.getMarks())
                .explanation(question.getExplanation())
                .options(optionDTOs)
                .build();
    }
}
