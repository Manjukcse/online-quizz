package com.example.exam.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InstructorApprovalRequest {
    @NotNull(message = "Approval status is required")
    private Boolean approve;

    @Min(value = 0, message = "Salary must be non-negative")
    private Integer salary;
}
