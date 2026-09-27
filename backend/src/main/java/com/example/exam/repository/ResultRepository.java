package com.example.exam.repository;

import com.example.exam.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByExamId(Long examId);
    Optional<Result> findByStudentIdAndExamId(Long studentId, Long examId);
    Boolean existsByStudentIdAndExamId(Long studentId, Long examId);
    List<Result> findByExamCreatedById(Long instructorId);
}
