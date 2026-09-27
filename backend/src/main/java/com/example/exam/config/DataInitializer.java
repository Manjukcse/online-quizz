package com.example.exam.config;

import com.example.exam.entity.*;
import com.example.exam.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing system roles and default seed users...");

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build()));

        Role instructorRole = roleRepository.findByName(RoleName.ROLE_INSTRUCTOR)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_INSTRUCTOR).build()));

        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_STUDENT).build()));

        // Seed Admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@exam.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .address("Admin HQ")
                    .mobile("9999999999")
                    .status(UserStatus.APPROVED)
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
            logger.info("Default Admin created: username=admin, password=admin123");
        }

        // Seed Sample Instructor
        User instructor = userRepository.findByUsername("instructor1").orElse(null);
        if (instructor == null) {
            instructor = User.builder()
                    .username("instructor1")
                    .email("instructor@exam.com")
                    .password(passwordEncoder.encode("instructor123"))
                    .firstName("John")
                    .lastName("Doe")
                    .address("123 Teacher Lane")
                    .mobile("8888888888")
                    .status(UserStatus.APPROVED)
                    .salary(60000)
                    .roles(Set.of(instructorRole))
                    .build();
            instructor = userRepository.save(instructor);
            logger.info("Sample Instructor created: username=instructor1, password=instructor123");
        }

        // Seed Sample Student
        User student = userRepository.findByUsername("student1").orElse(null);
        if (student == null) {
            student = User.builder()
                    .username("student1")
                    .email("student@exam.com")
                    .password(passwordEncoder.encode("student123"))
                    .firstName("Alice")
                    .lastName("Smith")
                    .address("456 Student St")
                    .mobile("7777777777")
                    .status(UserStatus.APPROVED)
                    .roles(Set.of(studentRole))
                    .build();
            userRepository.save(student);
            logger.info("Sample Student created: username=student1, password=student123");
        }

        // Seed Sample Exam if none exists
        if (examRepository.count() == 0 && instructor != null) {
            Exam javaExam = Exam.builder()
                    .title("Java & Spring Boot Fundamentals")
                    .description("Assessment covering Java 21 features, Spring Core, Data JPA, and REST APIs.")
                    .code("JAVA-101")
                    .totalMarks(20)
                    .passingPercentage(50)
                    .examDate(LocalDate.now())
                    .startTime(LocalTime.of(0, 0))
                    .endTime(LocalTime.of(23, 59))
                    .durationMinutes(30)
                    .isPublished(true)
                    .createdBy(instructor)
                    .build();
            javaExam = examRepository.save(javaExam);

            Question q1 = Question.builder()
                    .exam(javaExam)
                    .questionText("Which annotation is used to mark a class as a Spring Boot REST Controller?")
                    .marks(10)
                    .explanation("@RestController combines @Controller and @ResponseBody")
                    .build();
            q1.setOptions(List.of(
                    Option.builder().question(q1).optionText("@Controller").isCorrect(false).build(),
                    Option.builder().question(q1).optionText("@RestController").isCorrect(true).build(),
                    Option.builder().question(q1).optionText("@Service").isCorrect(false).build(),
                    Option.builder().question(q1).optionText("@Component").isCorrect(false).build()
            ));

            Question q2 = Question.builder()
                    .exam(javaExam)
                    .questionText("What is the default HTTP status code returned for successful resource creation?")
                    .marks(10)
                    .explanation("201 Created is standard for successful POST requests")
                    .build();
            q2.setOptions(List.of(
                    Option.builder().question(q2).optionText("200 OK").isCorrect(false).build(),
                    Option.builder().question(q2).optionText("201 Created").isCorrect(true).build(),
                    Option.builder().question(q2).optionText("204 No Content").isCorrect(false).build(),
                    Option.builder().question(q2).optionText("400 Bad Request").isCorrect(false).build()
            ));

            questionRepository.saveAll(List.of(q1, q2));
            logger.info("Sample Exam 'JAVA-101' created with 2 questions.");
        }
    }
}
