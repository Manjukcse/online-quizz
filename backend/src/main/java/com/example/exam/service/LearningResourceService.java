package com.example.exam.service;

import com.example.exam.dto.LearningResourceDTO;

import java.util.List;

public interface LearningResourceService {
    List<LearningResourceDTO> getAllResources();
    List<LearningResourceDTO> getResourcesByExamId(Long examId);
    LearningResourceDTO createResource(LearningResourceDTO dto);
    void deleteResource(Long resourceId);
}
