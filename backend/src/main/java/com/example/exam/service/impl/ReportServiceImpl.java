package com.example.exam.service.impl;

import com.example.exam.dto.AdminReportDTO;
import com.example.exam.entity.PassStatus;
import com.example.exam.entity.Result;
import com.example.exam.entity.RoleName;
import com.example.exam.entity.UserStatus;
import com.example.exam.repository.ExamRepository;
import com.example.exam.repository.QuestionRepository;
import com.example.exam.repository.ResultRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminReportDTO getAdminReport() {
        long totalStudents = userRepository.countByRoleName(RoleName.ROLE_STUDENT);
        long totalApprovedInstructors = userRepository.countByRoleNameAndStatus(RoleName.ROLE_INSTRUCTOR, UserStatus.APPROVED);
        long totalPendingInstructors = userRepository.countByRoleNameAndStatus(RoleName.ROLE_INSTRUCTOR, UserStatus.PENDING);
        long totalExams = examRepository.count();
        long totalQuestions = questionRepository.count();

        List<Result> results = resultRepository.findAll();
        long totalAttempts = results.size();
        long passedAttempts = results.stream().filter(r -> r.getPassStatus() == PassStatus.PASS).count();
        long failedAttempts = totalAttempts - passedAttempts;

        double passRate = totalAttempts > 0 ? ((double) passedAttempts / totalAttempts) * 100.0 : 0.0;

        return AdminReportDTO.builder()
                .totalStudents(totalStudents)
                .totalApprovedInstructors(totalApprovedInstructors)
                .totalPendingInstructors(totalPendingInstructors)
                .totalExams(totalExams)
                .totalQuestions(totalQuestions)
                .totalExamAttempts(totalAttempts)
                .totalPassedAttempts(passedAttempts)
                .totalFailedAttempts(failedAttempts)
                .overallPassRatePercentage(Math.round(passRate * 100.0) / 100.0)
                .build();
    }
}
