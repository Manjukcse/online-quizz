package com.example.exam.service.impl;

import com.example.exam.dto.ExamRegistrationResponse;
import com.example.exam.entity.Exam;
import com.example.exam.entity.ExamRegistration;
import com.example.exam.entity.RegistrationStatus;
import com.example.exam.entity.User;
import com.example.exam.exception.DuplicateRegistrationException;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.ExamRegistrationRepository;
import com.example.exam.repository.ExamRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.ExamRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamRegistrationServiceImpl implements ExamRegistrationService {

    @Autowired
    private ExamRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    @Transactional
    public ExamRegistrationResponse registerStudentForExam(Long studentId, Long examId) {
        if (registrationRepository.existsByStudentIdAndExamId(studentId, examId)) {
            throw new DuplicateRegistrationException("Student is already registered for this exam.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        ExamRegistration registration = ExamRegistration.builder()
                .student(student)
                .exam(exam)
                .status(RegistrationStatus.REGISTERED)
                .build();

        return mapToResponse(registrationRepository.save(registration));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamRegistrationResponse> getStudentRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamRegistrationResponse> getRegistrationsByExamId(Long examId) {
        return registrationRepository.findByExamId(examId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ExamRegistrationResponse mapToResponse(ExamRegistration registration) {
        return ExamRegistrationResponse.builder()
                .id(registration.getId())
                .studentId(registration.getStudent().getId())
                .studentName(registration.getStudent().getFullName())
                .examId(registration.getExam().getId())
                .examTitle(registration.getExam().getTitle())
                .status(registration.getStatus().name())
                .registeredAt(registration.getRegisteredAt())
                .build();
    }
}
