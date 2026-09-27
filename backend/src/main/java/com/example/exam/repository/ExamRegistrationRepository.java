package com.example.exam.repository;

import com.example.exam.entity.ExamRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRegistrationRepository extends JpaRepository<ExamRegistration, Long> {
    Optional<ExamRegistration> findByStudentIdAndExamId(Long studentId, Long examId);
    Boolean existsByStudentIdAndExamId(Long studentId, Long examId);
    List<ExamRegistration> findByStudentId(Long studentId);
    List<ExamRegistration> findByExamId(Long examId);
    long countByExamId(Long examId);
}
