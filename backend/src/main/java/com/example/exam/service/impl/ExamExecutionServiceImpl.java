package com.example.exam.service.impl;

import com.example.exam.dto.*;
import com.example.exam.entity.*;
import com.example.exam.exception.*;
import com.example.exam.repository.*;
import com.example.exam.service.ExamExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamExecutionServiceImpl implements ExamExecutionService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRegistrationRepository registrationRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Override
    @Transactional(readOnly = true)
    public ExamDetailForAttemptDTO startExam(Long studentId, Long examId) {
        userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        // Check if student is registered
        boolean isRegistered = registrationRepository.existsByStudentIdAndExamId(studentId, examId);
        if (!isRegistered) {
            throw new BadRequestException("You must register for this exam before starting it.");
        }

        // Check if already completed
        if (resultRepository.existsByStudentIdAndExamId(studentId, examId)) {
            throw new InvalidExamSubmissionException("You have already submitted this exam.");
        }

        // Validate timing
        validateExamWindow(exam);

        List<QuestionForStudentDTO> questionDTOs = exam.getQuestions().stream()
                .map(q -> QuestionForStudentDTO.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .marks(q.getMarks())
                        .options(q.getOptions().stream()
                                .map(o -> OptionForStudentDTO.builder()
                                        .id(o.getId())
                                        .optionText(o.getOptionText())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ExamDetailForAttemptDTO.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .totalMarks(exam.getTotalMarks())
                .passingPercentage(exam.getPassingPercentage())
                .durationMinutes(exam.getDurationMinutes())
                .questions(questionDTOs)
                .build();
    }

    @Override
    @Transactional
    public ResultResponse submitExam(Long studentId, SubmitExamRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.getExamId()));

        if (resultRepository.existsByStudentIdAndExamId(studentId, exam.getId())) {
            throw new InvalidExamSubmissionException("You have already submitted this exam. Duplicate submissions are not allowed.");
        }

        // Validate timing for submission
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = exam.getEndDateTime();
        if (end != null && now.isAfter(end)) {
            throw new ExamExpiredException("Exam time is over. Submission rejected.");
        }

        List<Question> questions = questionRepository.findByExamId(exam.getId());

        Map<Long, StudentAnswerDTO> submittedAnswerMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (StudentAnswerDTO dto : request.getAnswers()) {
                if (dto.getQuestionId() != null) {
                    submittedAnswerMap.put(dto.getQuestionId(), dto);
                }
            }
        }

        int totalQuestions = questions.size();
        int attemptedQuestions = 0;
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int totalMarks = 0;
        int obtainedMarks = 0;

        List<Answer> answerEntities = new ArrayList<>();

        Result result = Result.builder()
                .student(student)
                .exam(exam)
                .totalQuestions(totalQuestions)
                .attemptedQuestions(0)
                .correctAnswers(0)
                .wrongAnswers(0)
                .totalMarks(0)
                .obtainedMarks(0)
                .percentage(0.0)
                .passStatus(PassStatus.FAIL)
                .build();

        for (Question question : questions) {
            totalMarks += question.getMarks();
            StudentAnswerDTO studentAnswerDTO = submittedAnswerMap.get(question.getId());

            Option selectedOption = null;
            boolean isCorrect = false;
            int marksObtained = 0;

            if (studentAnswerDTO != null && studentAnswerDTO.getSelectedOptionId() != null) {
                attemptedQuestions++;
                selectedOption = optionRepository.findById(studentAnswerDTO.getSelectedOptionId()).orElse(null);

                if (selectedOption != null && Boolean.TRUE.equals(selectedOption.getIsCorrect())) {
                    isCorrect = true;
                    marksObtained = question.getMarks();
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            }

            obtainedMarks += marksObtained;

            Answer answer = Answer.builder()
                    .result(result)
                    .question(question)
                    .selectedOption(selectedOption)
                    .isCorrect(isCorrect)
                    .marksObtained(marksObtained)
                    .build();

            answerEntities.add(answer);
        }

        double percentage = totalMarks > 0 ? ((double) obtainedMarks / totalMarks) * 100.0 : 0.0;
        PassStatus passStatus = percentage >= exam.getPassingPercentage() ? PassStatus.PASS : PassStatus.FAIL;

        result.setAttemptedQuestions(attemptedQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setWrongAnswers(wrongAnswers);
        result.setTotalMarks(totalMarks);
        result.setObtainedMarks(obtainedMarks);
        result.setPercentage(Math.round(percentage * 100.0) / 100.0);
        result.setPassStatus(passStatus);
        result.setAnswers(answerEntities);

        Result savedResult = resultRepository.save(result);

        // Update Registration status to COMPLETED
        registrationRepository.findByStudentIdAndExamId(studentId, exam.getId())
                .ifPresent(reg -> {
                    reg.setStatus(RegistrationStatus.COMPLETED);
                    registrationRepository.save(reg);
                });

        return mapToResultResponse(savedResult);
    }

    private void validateExamWindow(Exam exam) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = exam.getStartDateTime();
        LocalDateTime end = exam.getEndDateTime();

        if (start != null && now.isBefore(start)) {
            throw new ExamNotStartedException("Exam has not started yet. Please wait until the scheduled start time.");
        }

        if (end != null && now.isAfter(end)) {
            throw new ExamExpiredException("Exam time is over.");
        }
    }

    private ResultResponse mapToResultResponse(Result result) {
        List<AnswerDetailDTO> answerDetails = result.getAnswers().stream()
                .map(a -> {
                    Option correctOpt = a.getQuestion().getOptions().stream()
                            .filter(o -> Boolean.TRUE.equals(o.getIsCorrect()))
                            .findFirst().orElse(null);

                    return AnswerDetailDTO.builder()
                            .questionId(a.getQuestion().getId())
                            .questionText(a.getQuestion().getQuestionText())
                            .questionMarks(a.getQuestion().getMarks())
                            .selectedOptionId(a.getSelectedOption() != null ? a.getSelectedOption().getId() : null)
                            .selectedOptionText(a.getSelectedOption() != null ? a.getSelectedOption().getOptionText() : "Not Attempted")
                            .correctOptionId(correctOpt != null ? correctOpt.getId() : null)
                            .correctOptionText(correctOpt != null ? correctOpt.getOptionText() : "")
                            .isCorrect(a.getIsCorrect())
                            .marksObtained(a.getMarksObtained())
                            .explanation(a.getQuestion().getExplanation())
                            .build();
                })
                .collect(Collectors.toList());

        return ResultResponse.builder()
                .id(result.getId())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getFullName())
                .examId(result.getExam().getId())
                .examTitle(result.getExam().getTitle())
                .totalQuestions(result.getTotalQuestions())
                .attemptedQuestions(result.getAttemptedQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .wrongAnswers(result.getWrongAnswers())
                .totalMarks(result.getTotalMarks())
                .obtainedMarks(result.getObtainedMarks())
                .percentage(result.getPercentage())
                .passingPercentage(result.getExam().getPassingPercentage())
                .passStatus(result.getPassStatus().name())
                .submittedAt(result.getSubmittedAt())
                .answers(answerDetails)
                .build();
    }
}
