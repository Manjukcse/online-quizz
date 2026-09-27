package com.example.exam.service.impl;

import com.example.exam.dto.ExamRequest;
import com.example.exam.dto.ExamResponse;
import com.example.exam.entity.Exam;
import com.example.exam.entity.RoleName;
import com.example.exam.entity.User;
import com.example.exam.exception.BadRequestException;
import com.example.exam.exception.ForbiddenException;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.ExamRegistrationRepository;
import com.example.exam.repository.ExamRepository;
import com.example.exam.repository.ResultRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRegistrationRepository examRegistrationRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> getAllExams(Long currentStudentId) {
        return examRepository.findByIsPublishedTrue().stream()
                .map(exam -> mapToExamResponse(exam, currentStudentId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> getInstructorExams(Long instructorId) {
        return examRepository.findByCreatedById(instructorId).stream()
                .map(exam -> mapToExamResponse(exam, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponse getExamById(Long examId, Long currentStudentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        return mapToExamResponse(exam, currentStudentId);
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + instructorId));

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BadRequestException("End time must be strictly after start time.");
        }

        String code = request.getCode();
        if (code == null || code.isBlank()) {
            code = "EXAM-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        Exam exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .code(code)
                .totalMarks(request.getTotalMarks())
                .passingPercentage(request.getPassingPercentage())
                .examDate(request.getExamDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .durationMinutes(request.getDurationMinutes())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .createdBy(instructor)
                .build();

        return mapToExamResponse(examRepository.save(exam), null);
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Long examId, ExamRequest request, Long userId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (!isAdmin && !exam.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to update this exam.");
        }

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BadRequestException("End time must be strictly after start time.");
        }

        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setTotalMarks(request.getTotalMarks());
        exam.setPassingPercentage(request.getPassingPercentage());
        exam.setExamDate(request.getExamDate());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());
        exam.setDurationMinutes(request.getDurationMinutes());

        if (request.getIsPublished() != null) {
            exam.setIsPublished(request.getIsPublished());
        }

        return mapToExamResponse(examRepository.save(exam), null);
    }

    @Override
    @Transactional
    public void deleteExam(Long examId, Long userId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (!isAdmin && !exam.getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to delete this exam.");
        }

        examRepository.delete(exam);
    }

    private ExamResponse mapToExamResponse(Exam exam, Long currentStudentId) {
        boolean isRegistered = false;
        boolean isCompleted = false;

        if (currentStudentId != null) {
            isRegistered = examRegistrationRepository.existsByStudentIdAndExamId(currentStudentId, exam.getId());
            isCompleted = resultRepository.existsByStudentIdAndExamId(currentStudentId, exam.getId());
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = exam.getStartDateTime();
        LocalDateTime end = exam.getEndDateTime();

        String timingStatus = "IN_PROGRESS";
        if (start != null && now.isBefore(start)) {
            timingStatus = "NOT_STARTED";
        } else if (end != null && now.isAfter(end)) {
            timingStatus = "EXPIRED";
        }

        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .code(exam.getCode())
                .totalMarks(exam.getTotalMarks())
                .passingPercentage(exam.getPassingPercentage())
                .examDate(exam.getExamDate())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .durationMinutes(exam.getDurationMinutes())
                .isPublished(exam.getIsPublished())
                .createdById(exam.getCreatedBy().getId())
                .createdByName(exam.getCreatedBy().getFullName())
                .totalQuestions(exam.getQuestions() != null ? exam.getQuestions().size() : 0)
                .isRegistered(isRegistered)
                .isCompleted(isCompleted)
                .timingStatus(timingStatus)
                .createdAt(exam.getCreatedAt())
                .build();
    }
}
