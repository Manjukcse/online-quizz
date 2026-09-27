package com.example.exam;

import com.example.exam.dto.ResultResponse;
import com.example.exam.dto.StudentAnswerDTO;
import com.example.exam.dto.SubmitExamRequest;
import com.example.exam.entity.*;
import com.example.exam.exception.ExamNotStartedException;
import com.example.exam.repository.*;
import com.example.exam.service.impl.ExamExecutionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExamExecutionServiceTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExamRegistrationRepository registrationRepository;

    @Mock
    private ResultRepository resultRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private OptionRepository optionRepository;

    @InjectMocks
    private ExamExecutionServiceImpl examExecutionService;

    private User student;
    private Exam exam;
    private Question question1;
    private Option opt1Correct;
    private Option opt2Wrong;

    @BeforeEach
    void setUp() {
        student = User.builder().id(1L).username("student1").firstName("Alice").lastName("Smith").build();

        exam = Exam.builder()
                .id(100L)
                .title("Math Quiz")
                .totalMarks(10)
                .passingPercentage(50)
                .examDate(LocalDate.now())
                .startTime(LocalTime.of(0, 0))
                .endTime(LocalTime.of(23, 59))
                .durationMinutes(30)
                .build();

        question1 = Question.builder()
                .id(10L)
                .exam(exam)
                .questionText("2 + 2?")
                .marks(10)
                .build();

        opt1Correct = Option.builder().id(101L).question(question1).optionText("4").isCorrect(true).build();
        opt2Wrong = Option.builder().id(102L).question(question1).optionText("5").isCorrect(false).build();
        question1.setOptions(List.of(opt1Correct, opt2Wrong));
    }

    @Test
    void testStartExamThrowsWhenNotStarted() {
        Exam futureExam = Exam.builder()
                .id(200L)
                .examDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(examRepository.findById(200L)).thenReturn(Optional.of(futureExam));
        when(registrationRepository.existsByStudentIdAndExamId(1L, 200L)).thenReturn(true);
        when(resultRepository.existsByStudentIdAndExamId(1L, 200L)).thenReturn(false);

        assertThrows(ExamNotStartedException.class, () -> examExecutionService.startExam(1L, 200L));
    }

    @Test
    void testSubmitExamSuccessPass() {
        SubmitExamRequest request = new SubmitExamRequest();
        request.setExamId(100L);
        request.setAnswers(List.of(new StudentAnswerDTO(10L, 101L)));

        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(examRepository.findById(100L)).thenReturn(Optional.of(exam));
        when(resultRepository.existsByStudentIdAndExamId(1L, 100L)).thenReturn(false);
        when(questionRepository.findByExamId(100L)).thenReturn(List.of(question1));
        when(optionRepository.findById(101L)).thenReturn(Optional.of(opt1Correct));

        when(resultRepository.save(any(Result.class))).thenAnswer(i -> {
            Result r = i.getArgument(0);
            r.setId(500L);
            return r;
        });

        ResultResponse response = examExecutionService.submitExam(1L, request);

        assertNotNull(response);
        assertEquals(10, response.getObtainedMarks());
        assertEquals(100.0, response.getPercentage());
        assertEquals("PASS", response.getPassStatus());
    }
}
