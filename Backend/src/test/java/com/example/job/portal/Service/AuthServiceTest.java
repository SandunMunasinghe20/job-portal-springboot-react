package com.example.job.portal.Service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

  /*  @InjectMocks
    private AuthService authService;

    @Mock
    private SeekerRepo seekerRepo;
    @Mock
    private EmployerRepo employerRepo;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserDto userDto;
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private JWTService jwtService;



    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerSeeker_WhenEmailExists_ShouldReturnBadRequest(){
        String email = "test@gmail.com";
        String password = "password";

        when(userDto.getEmail()).thenReturn(email);
        when(userDto.getPassword()).thenReturn(password);

        when(seekerRepo.findByEmail(email)).thenReturn(Optional.of(new Seeker()));
        when(employerRepo.findByEmail(email)).thenReturn(Optional.of(new Employer()));


        ResponseEntity<String> response = authService.registerSeeker(userDto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Account already exists with this email", response.getBody());
    }

    @Test
    void registerSeeker_whenEmailDoesNotExist_ShouldReturnBadRequest(){

        String password = "password";

        when(userDto.getEmail()).thenReturn(null);
        when(userDto.getPassword()).thenReturn(password);

        ResponseEntity<String> response = authService.registerSeeker(userDto);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid email or password", response.getBody());
    }

    @Test
    void registerSeeker() {
        String email = "test2gmail.com";
        String password = "password";

        when(userDto.getEmail()).thenReturn(email);
        when(userDto.getPassword()).thenReturn(password);

        ResponseEntity<String> response = authService.registerSeeker(userDto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully registered", response.getBody());
    }

    @Test
    void login(){
        String email = "test@example.com";
        String password = "password123";
        String fakeToken = "mocked.jwt.token";

        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail(email);
        request.setPassword(password);

        UserDetails userDetails = User.builder()
                .username(email)
                .password(password)
                .roles("seeker")
                .build();

        // Mocking behavior
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn(fakeToken);

        // Act
        LoginResponseDTO response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals(fakeToken, response.getToken());
    }

/*
    @Test
    void wrongEmail_login(){
        String email = "a@gmail.com";
        String password = "password";
        String fakeToken = "mocked.jwt.token";

        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail(email);
        request.setPassword(password);

        doThrow(new BadCredentialsException("Invalid email or password"))
                .when(authenticationManager).authenticate(
                        new UsernamePasswordAuthenticationToken(email, password)
                );

        Exception exception = assertThrows(BadCredentialsException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid email or password", exception.getMessage());

    }*/




}
