package com.example.exam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDTO {
    private Long id;

    @NotBlank(message = "Option text cannot be blank")
    private String optionText;

    private Boolean isCorrect;
}
