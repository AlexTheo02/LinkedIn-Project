import React, { useState } from 'react';
import s from "./ProfilePageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { differenceInYears } from 'date-fns';

const profilePic = require('./../../Images/profile_ergasiaSite.png');

const professional_experience = `John Doe has over 5 years of experience in software development, primarily focused on web and mobile applications. 
He has worked in various roles, from junior developer to lead engineer, and has been involved in all stages of 
software development, including requirements analysis, design, implementation, testing, and maintenance.

At Tech Company, John led the development of several high-profile projects, including an e-commerce platform 
that served thousands of users daily and a mobile application for real-time weather updates. His work often 
involves close collaboration with cross-functional teams, including UX designers, QA engineers, and product 
managers, to ensure the successful delivery of high-quality products.

John is particularly skilled in optimizing application performance and has a keen interest in exploring new 
technologies and methodologies to improve development workflows. He is known for his problem-solving abilities, 
attention to detail, and commitment to delivering exceptional user experiences. In addition to his technical 
skills, John has demonstrated strong leadership and mentoring capabilities, helping to train and guide junior 
developers in their careers.`;

const educational_experience = `John holds a Bachelor's Degree in Computer Science from the University of Technology, where he graduated with 
honors. During his time at the university, he developed a strong foundation in computer science principles, 
including algorithms, data structures, and software engineering practices.

He was actively involved in various student organizations and projects, including leading a team in the university's 
annual hackathon, where they developed an innovative solution for real-time public transportation tracking. John's 
academic coursework was complemented by internships at several technology companies, where he gained practical 
experience in software development and project management.

In addition to his formal education, John has pursued numerous online courses and certifications to stay updated 
with the latest technologies and industry trends. He is particularly interested in areas such as cloud computing, 
machine learning, and cybersecurity, and continuously seeks opportunities for professional development.`;

const skills = `JavaScript, React, Node.js, Express, MongoDB, SQL, HTML, CSS, TypeScript, Redux, Angular, Vue.js, RESTful APIs, 
GraphQL, Docker, Kubernetes, AWS, Azure, GCP, CI/CD, Git, Webpack, Babel, Jest, Mocha, Cypress, Agile methodologies, 
Scrum, Kanban, UX/UI design principles, Responsive design, Cross-browser compatibility, Performance optimization, 
Security best practices, Automated testing, Microservices architecture, Serverless architecture, DevOps, Machine 
Learning, Data Analysis, Python, Java, C#, Swift, Objective-C, Mobile development (iOS/Android), REST APIs, 
API design, System design, Code review, Technical documentation, Mentoring and leadership, Public speaking, 
Project management, Team collaboration, Remote work experience.`;

const network = [
    { profilePic: profilePic, name: 'Alice', surname: 'Smith', workingPosition: 'Product Manager', employmentOrganization: 'Tech Innovations' },
    { profilePic: profilePic, name: 'Bob', surname: 'Johnson', workingPosition: 'Data Scientist', employmentOrganization: 'DataCorp' },
    { profilePic: profilePic, name: 'Carol', surname: 'Williams', workingPosition: 'UX Designer', employmentOrganization: 'Creative Solutions' },
    { profilePic: profilePic, name: 'David', surname: 'Brown', workingPosition: 'Backend Developer', employmentOrganization: 'WebWorks' },
    { profilePic: profilePic, name: 'Eve', surname: 'Jones', workingPosition: 'Frontend Developer', employmentOrganization: 'NextGen Web' },
    { profilePic: profilePic, name: 'Frank', surname: 'Davis', workingPosition: 'DevOps Engineer', employmentOrganization: 'Cloud Services Inc.' },
    { profilePic: profilePic, name: 'Grace', surname: 'Miller', workingPosition: 'Project Manager', employmentOrganization: 'Tech Projects' },
    { profilePic: profilePic, name: 'Hank', surname: 'Wilson', workingPosition: 'System Architect', employmentOrganization: 'System Solutions' },
    { profilePic: profilePic, name: 'Ivy', surname: 'Taylor', workingPosition: 'QA Engineer', employmentOrganization: 'QualityFirst' },
    { profilePic: profilePic, name: 'Jack', surname: 'Anderson', workingPosition: 'Mobile Developer', employmentOrganization: 'Mobile Innovations' },
    { profilePic: profilePic, name: 'Karen', surname: 'Thomas', workingPosition: 'Security Specialist', employmentOrganization: 'SecureNet' },
    { profilePic: profilePic, name: 'Leo', surname: 'Jackson', workingPosition: 'Full Stack Developer', employmentOrganization: 'Tech Hub' },
    { profilePic: profilePic, name: 'Mia', surname: 'White', workingPosition: 'Cloud Engineer', employmentOrganization: 'Cloud Solutions' },
    { profilePic: profilePic, name: 'Nina', surname: 'Harris', workingPosition: 'Database Administrator', employmentOrganization: 'Data Systems' },
    { profilePic: profilePic, name: 'Oscar', surname: 'Martin', workingPosition: 'AI Engineer', employmentOrganization: 'Future Tech' },
    { profilePic: profilePic, name: 'Paul', surname: 'Garcia', workingPosition: 'Machine Learning Engineer', employmentOrganization: 'ML Solutions' },
    { profilePic: profilePic, name: 'Quinn', surname: 'Martinez', workingPosition: 'Blockchain Developer', employmentOrganization: 'CryptoTech' },
    { profilePic: profilePic, name: 'Rachel', surname: 'Robinson', workingPosition: 'Technical Writer', employmentOrganization: 'DocuTech' },
    { profilePic: profilePic, name: 'Steve', surname: 'Clark', workingPosition: 'Network Engineer', employmentOrganization: 'NetSolutions' },
    { profilePic: profilePic, name: 'Tina', surname: 'Lewis', workingPosition: 'Product Designer', employmentOrganization: 'Design Innovations' },
    { profilePic: profilePic, name: 'Uma', surname: 'Walker', workingPosition: 'Cybersecurity Analyst', employmentOrganization: 'SecureTech' },
    { profilePic: profilePic, name: 'Vince', surname: 'Hall', workingPosition: 'IT Support Specialist', employmentOrganization: 'SupportNow' },
    { profilePic: profilePic, name: 'Wendy', surname: 'Allen', workingPosition: 'Sales Engineer', employmentOrganization: 'TechSales' },
    { profilePic: profilePic, name: 'Xander', surname: 'Young', workingPosition: 'Game Developer', employmentOrganization: 'Game World' },
    { profilePic: profilePic, name: 'Yara', surname: 'Hernandez', workingPosition: 'SEO Specialist', employmentOrganization: 'WebRank' },
    { profilePic: profilePic, name: 'Zack', surname: 'King', workingPosition: 'Cloud Architect', employmentOrganization: 'Cloud Masters' }
];

const user = {
    name: 'John',
    surname: 'Doe',
    date_of_birth: "1942-11-20T23:00:00.000+00:00",
    workingPosition: 'Software Engineer',
    employmentOrganization: 'Tech Company',
    location: 'New York, USA',
    isPhonePublic: true,
    phoneNumber: '+306934587275',
    professional_experience: professional_experience,
    educational_experience: educational_experience,
    skills: skills,
    network: network
};

function calculateAge(birthDate) {
    const dateOfBirth = new Date(birthDate);
    const age = differenceInYears(new Date(), dateOfBirth);
    return age;
}

function ExpandableText({ text, maxWords = 50 }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const words = text.split(' ');
    const isTruncated = words.length > maxWords;
    const displayedText = isTruncated && !expanded ? words.slice(0, maxWords).join(' ') + '...' : text;

    return (
        <div>
            <p className={s.expandable_text}>{displayedText}</p>
            {isTruncated && (
                <button className={s.show_more_button} onClick={toggleExpansion}>
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
}

function ProfilePage(user_id) {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div>
            <NavBar />
            <div className={s.background_image}>
                <div className={s.profile}>
                    <div className={s.container}>
                        <div className={s.profile_field}>
                            <img src={profilePic} alt="Profile" />
                            <h1>{user.name} {user.surname}</h1>
                            <b>{user.workingPosition} at {user.employmentOrganization}</b>
                            <p>{calculateAge(user.date_of_birth)} years old</p>
                            <p>{user.location}</p>
                        </div>
                        <div className={s.operations}>
                            <div className={s.buttons}>
                                <button
                                    className={isFollowing ? s.followed_button : s.follow_button} onClick={handleFollowClick}>
                                    {isFollowing ? 'Followed' : 'Follow'}
                                    <FontAwesomeIcon className={s.follow_button_icon} icon={isFollowing ? faCheck : faUserPlus} />
                                </button>
                                <button className={s.message_button}>Message</button>
                            </div>
                            <div className={s.contact_info}>
                                {user.isPhonePublic ? (
                                    <>
                                        <p>Phone Number:</p>
                                        <p>{user.phoneNumber}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className={s.container}>
                        <h3>Professional Experience:</h3>
                        <ExpandableText text={user.professional_experience} />
                    </div>
                    <div className={s.container}>
                        <h3>Educational Experience:</h3>
                        <ExpandableText text={user.educational_experience} />
                    </div>
                    <div className={s.container}>
                        <h3>Skills:</h3>
                        <ExpandableText text={user.skills} />
                    </div>
                </div>
                <div className={s.network}>
                    <h2>Network:</h2>
                    <div className={s.users_list}>
                        <ul>
                            {user.network.map((connected_user, index) => (
                                <li key={index} onClick={() => {}}>
                                    <img src={connected_user.profilePic} alt={`${connected_user.name} ${connected_user.surname}`} />
                                    <div className={s.user_info}>
                                        <b>{connected_user.name} {connected_user.surname}</b>
                                        <b className={s.position}>{connected_user.workingPosition} at {connected_user.employmentOrganization}</b>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
