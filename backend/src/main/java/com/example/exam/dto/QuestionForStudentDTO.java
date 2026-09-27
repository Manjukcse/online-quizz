package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionForStudentDTO {
    private Long id;
    private String questionText;
    private Integer marks;
    private List<OptionForStudentDTO> options;
}
