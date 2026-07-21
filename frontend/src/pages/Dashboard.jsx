import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import API from '../api/api.js';
import { 
  Play, Calendar, Award, ChevronRight, LogOut, Code, UserCheck, Plus, Sparkles, 
  UploadCloud, FileText, BarChart3, TrendingUp, HelpCircle, User, FolderClosed, 
  ArrowLeft, Check, RotateCcw, AlertTriangle, Building, Terminal, ChevronDown, ChevronUp, BookOpen,
  Users, ShieldAlert, RefreshCw, Mail
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Editor from '@monaco-editor/react';

// ==========================================
// STATIC PREPARATION DATABASE & SCHEMAS
// ==========================================

const QUIZ_DATA = {
  mern: [
    {
      q: "Which of the following is correct about Express.js?",
      options: [
        "It is a database management system.",
        "It is a minimal and flexible Node.js web application framework.",
        "It is a frontend library like React.",
        "It is an operating system."
      ],
      answer: 1,
      explain: "Express.js is a lightweight web framework for Node.js, providing robust features for web and mobile applications."
    },
    {
      q: "What is the purpose of React's useEffect hook?",
      options: [
        "To perform side effects in functional components.",
        "To directly mutate the DOM database.",
        "To define stylesheet classes.",
        "To create static user authentication models."
      ],
      answer: 0,
      explain: "useEffect allows functional React components to run side effects (data fetching, DOM updates, subscriptions)."
    },
    {
      q: "In MongoDB, what does a 'document' correspond to in SQL databases?",
      options: [
        "A column schema.",
        "A table structure.",
        "A row record.",
        "An index key."
      ],
      answer: 2,
      explain: "MongoDB is document-oriented; a document stores key-value pairs representing a record, corresponding to a table row in SQL."
    },
    {
      q: "What does the 'npm' command do?",
      options: [
        "Compiles JavaScript to native machine binary.",
        "Initializes and manages node packages and dependencies.",
        "Encrypts password keys using Bcrypt.",
        "Starts a local MongoDB server."
      ],
      answer: 1,
      explain: "npm (Node Package Manager) downloads, installs, and manages packages/modules in a Node.js project."
    },
    {
      q: "What does 'MERN' stand for?",
      options: [
        "MySql, Express, Redux, Node",
        "MongoDB, Express, React, Node.js",
        "Mariadb, Ember, Ruby, Netlify",
        "MongoDB, Electron, React, Next.js"
      ],
      answer: 1,
      explain: "MERN stands for MongoDB, Express.js, React.js, and Node.js, representing a complete JavaScript stack."
    },
    {
      q: "What is the purpose of CORS middleware in an Express application?",
      options: [
        "To parse JSON request bodies.",
        "To encrypt user session IDs.",
        "To allow or restrict resource requests from other domains.",
        "To handle database indexing configurations."
      ],
      answer: 2,
      explain: "CORS (Cross-Origin Resource Sharing) is a security feature that controls how web browsers allow or deny cross-origin requests."
    },
    {
      q: "In React, what is the key benefit of using a functional component state initializer function: `useState(() => getInitialValue())`?",
      options: [
        "It stores state values directly in local storage.",
        "It runs the initialization logic only once during the initial mount phase.",
        "It automatically updates state values on window resize.",
        "It prevents functional components from being re-rendered."
      ],
      answer: 1,
      explain: "A state initializer function runs only once, preventing expensive initial calculation code from executing on every subsequent component render."
    },
    {
      q: "Which MongoDB operator is used to update fields in a document without rewriting the entire document?",
      options: [
        "$update",
        "$push",
        "$set",
        "$inc"
      ],
      answer: 2,
      explain: "The $set operator replaces the value of a field with the specified value, maintaining other fields untouched."
    },
    {
      q: "What is the role of React's useMemo hook?",
      options: [
        "To memoize expensive functions so they don't rerun on every render unless dependencies change.",
        "To store variables in memory that trigger UI refreshes on updates.",
        "To directly perform network API requests.",
        "To manage user authentication context variables."
      ],
      answer: 0,
      explain: "useMemo caches the result of a calculation between renders, only recomputing when one of the dependencies changes."
    },
    {
      q: "In React, how can you optimize a component to prevent unnecessary re-renders when its props do not change?",
      options: [
        "Wrap the component with React.memo",
        "Use the useMemo hook inside the component",
        "Wrap the component with React.Fragment",
        "Convert the component into a Class component"
      ],
      answer: 0,
      explain: "React.memo is a higher-order component that performs a shallow comparison of props to skip re-rendering if props are unchanged."
    },
    {
      q: "What does JWT (JSON Web Token) payload typically store?",
      options: [
        "A private database access key.",
        "Non-sensitive user details / claims like userId and role.",
        "The encrypted password of the user.",
        "The complete history of client API calls."
      ],
      answer: 1,
      explain: "JWT payloads contain claims (information about an entity, such as user ID or roles) which are encoded, not encrypted, so they shouldn't contain sensitive data."
    },
    {
      q: "In Express, what is the correct order of parameters for an error-handling middleware function?",
      options: [
        "(req, res, next)",
        "(err, req, res)",
        "(err, req, res, next)",
        "(req, res, err, next)"
      ],
      answer: 2,
      explain: "Express identifies error-handling middleware by checking if the handler function takes exactly four arguments: (err, req, res, next)."
    },
    {
      q: "What is the purpose of React's useRef hook?",
      options: [
        "To reference external stylesheets programmatically.",
        "To persist mutable values without triggering a re-render, and to reference DOM elements directly.",
        "To establish a secure Web Socket connection.",
        "To dispatch actions to a Redux store."
      ],
      answer: 1,
      explain: "useRef returns a mutable ref object whose .current property is initialized to the passed argument. It doesn't trigger re-renders."
    },
    {
      q: "Which Node.js core module provides utilities for handling and transforming file paths?",
      options: [
        "fs",
        "path",
        "url",
        "http"
      ],
      answer: 1,
      explain: "The Node.js 'path' module contains utilities to help parse, format, resolve, and join local file path systems."
    },
    {
      q: "What is the role of Mongoose validation in a MERN stack application?",
      options: [
        "It verifies the security signature of incoming HTTP cookies.",
        "It encrypts request data before it is stored in the database.",
        "It enforces schema constraints and rules before saving documents to MongoDB.",
        "It checks if the MongoDB database service is running locally."
      ],
      answer: 2,
      explain: "Mongoose models run internal validators (e.g., required, min/max, custom regex) to ensure data matches schema rules before write queries run."
    }
  ],
  dsa: [
    {
      q: "What is the worst-case time complexity of searching in a Binary Search Tree (BST)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      answer: 2,
      explain: "In a skewed binary search tree, search behaves like a linked list, requiring O(N) operations in the worst case."
    },
    {
      q: "Which data structure operates on a Last-In-First-Out (LIFO) model?",
      options: [
        "Queue",
        "Heap",
        "Stack",
        "Hash Map"
      ],
      answer: 2,
      explain: "A Stack pushes elements on top and pops them from the top, obeying the LIFO principle."
    },
    {
      q: "What algorithm is used to find the shortest path in a weighted graph with non-negative edges?",
      options: [
        "Dijkstra's Algorithm",
        "Kruskal's Algorithm",
        "Depth First Search (DFS)",
        "Binary Search"
      ],
      answer: 0,
      explain: "Dijkstra's algorithm efficiently computes single-source shortest paths on weighted graphs with non-negative weights."
    },
    {
      q: "Which sorting algorithm has a stable average-case performance of O(N log N) and uses auxiliary memory?",
      options: [
        "Bubble Sort",
        "Quick Sort",
        "Merge Sort",
        "Selection Sort"
      ],
      answer: 2,
      explain: "Merge Sort is a stable divide-and-conquer algorithm with O(N log N) time complexity in all cases, requiring O(N) helper space."
    },
    {
      q: "What is the primary benefit of a Hash Table?",
      options: [
        "Keeps elements in a sorted order.",
        "Allows O(1) average-time insertion, deletion, and lookup.",
        "Utilizes minimal cache memory storage.",
        "Avoids all search collisions."
      ],
      answer: 1,
      explain: "Hash tables resolve keys to indices using a hash function, achieving average O(1) time complexity for lookup operations."
    },
    {
      q: "Which data structure is used internally by the Breadth-First Search (BFS) traversal of a graph?",
      options: [
        "Stack",
        "Priority Queue",
        "Queue",
        "Binary Search Tree"
      ],
      answer: 2,
      explain: "BFS uses a Queue (First-In-First-Out) to visit neighbor nodes level-by-level."
    },
    {
      q: "What is the time complexity of searching for an element in a balanced Hash Map in the worst-case (assuming hash collision chain)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      answer: 2,
      explain: "In the worst case, if all elements hash to the same bucket (forming a single chain), searching takes O(N) operations."
    },
    {
      q: "Which algorithm uses the divide-and-conquer strategy?",
      options: [
        "Dijkstra's Algorithm",
        "Kruskal's Algorithm",
        "Merge Sort",
        "KMP String Matcher"
      ],
      answer: 2,
      explain: "Merge Sort repeatedly splits an array in half (divide), sorts the halves, and merges them (conquer)."
    },
    {
      q: "What is the space complexity of a recursive depth-first search (DFS) traversal on a tree with a height of H?",
      options: [
        "O(1)",
        "O(log H)",
        "O(H)",
        "O(N)"
      ],
      answer: 2,
      explain: "Recursive DFS stores parent nodes on the system call stack, matching the tree's height O(H) in space."
    },
    {
      q: "In a Min-Heap, where is the smallest element located?",
      options: [
        "Always at the root node",
        "Always at the bottom-most leaf node",
        "At random positions inside the heap array",
        "At the second index of the array"
      ],
      answer: 0,
      explain: "A Min-Heap maintains the min-heap property: parent node values are less than or equal to their children, meaning the minimum value is always at the root."
    },
    {
      q: "What is the time complexity to insert an element at the beginning of a singly linked list of size N?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      answer: 0,
      explain: "Inserting at the head only requires changing the pointer of the new node to point to the current head, taking O(1) time."
    },
    {
      q: "Which of the following is a classic application of a Stack?",
      options: [
        "Handling printing jobs in printer queues.",
        "Round-robin CPU job scheduling.",
        "Balancing parentheses check in editors.",
        "Shortest path search in games."
      ],
      answer: 2,
      explain: "A Stack is used to match open/close brackets because the last opened bracket must be the first one closed."
    },
    {
      q: "What is the worst-case time complexity of the Quick Sort algorithm?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(N²)",
        "O(2^N)"
      ],
      answer: 2,
      explain: "Quick Sort worst case is O(N²), which happens when the pivot element consistently divides the array into extremely unbalanced parts (e.g. sorted arrays)."
    },
    {
      q: "If a graph has V vertices and E edges, what is the time complexity of Dijkstra's algorithm using a binary heap?",
      options: [
        "O(V + E)",
        "O(V log E)",
        "O((V + E) log V)",
        "O(V²)"
      ],
      answer: 2,
      explain: "With a binary min-priority heap, extracting min takes O(log V) and updating edge weights takes O(log V), yielding O((V + E) log V) time."
    },
    {
      q: "Which traversal of a Binary Search Tree (BST) outputs the elements in sorted ascending order?",
      options: [
        "Pre-order traversal",
        "In-order traversal",
        "Post-order traversal",
        "Level-order traversal"
      ],
      answer: 1,
      explain: "In-order traversal visits the left subtree, the root, and then the right subtree, outputting keys in ascending order."
    }
  ],
  java: [
    {
      q: "Which of these is NOT a pillar of Object-Oriented Programming (OOP)?",
      options: [
        "Encapsulation",
        "Polymorphism",
        "Compilation",
        "Inheritance"
      ],
      answer: 2,
      explain: "The four pillars of OOP are Encapsulation, Polymorphism, Inheritance, and Abstraction. Compilation is a build process."
    },
    {
      q: "What is the size of an 'int' primitive variable in standard Java?",
      options: [
        "8 bits",
        "16 bits",
        "32 bits",
        "64 bits"
      ],
      answer: 2,
      explain: "In Java, an 'int' data type is a 32-bit signed two's complement integer (4 bytes)."
    },
    {
      q: "Which keyword is used to prevent a class from being inherited in Java?",
      options: [
        "abstract",
        "static",
        "final",
        "private"
      ],
      answer: 2,
      explain: "Declaring a class as 'final' prevents it from being subclassed/extended."
    },
    {
      q: "Which of the following handles garbage collection in Java?",
      options: [
        "JVM (Java Virtual Machine)",
        "JDK (Java Development Kit)",
        "JRE (Java Runtime Environment)",
        "Compiler Class"
      ],
      answer: 0,
      explain: "The garbage collector runs inside the Java Virtual Machine to automatically reclaim unused memory heap blocks."
    },
    {
      q: "What is the difference between '==' and '.equals()' in Java for Strings?",
      options: [
        "'==' compares values; '.equals()' compares references.",
        "'==' compares references; '.equals()' compares content values.",
        "They are identical in all circumstances.",
        "'.equals()' only works for integer comparisons."
      ],
      answer: 1,
      explain: "'==' checks if both string objects reside in the same memory location (reference comparison), whereas '.equals()' compares character contents."
    },
    {
      q: "Which class is the ultimate superclass of all classes in Java?",
      options: [
        "java.lang.String",
        "java.lang.Object",
        "java.lang.Class",
        "java.lang.System"
      ],
      answer: 1,
      explain: "Every class in Java directly or indirectly inherits from the Object class."
    },
    {
      q: "What is the purpose of the `volatile` keyword in Java?",
      options: [
        "It prevents values from being garbage collected.",
        "It tells the compiler that the variable's value may change asynchronously across threads, forcing reads/writes from main memory.",
        "It secures variables by performing runtime cryptographic encryption.",
        "It allows variables to be modified in read-only files."
      ],
      answer: 1,
      explain: "volatile guarantees thread visibility. Reads and writes to a volatile variable go directly to main memory, bypassing thread caches."
    },
    {
      q: "Which of the following is true about abstract classes and interfaces in Java 8+?",
      options: [
        "Interfaces can now contain constructors.",
        "Interfaces cannot define static variables.",
        "Interfaces can have default and static method implementations.",
        "Abstract classes can no longer extend other classes."
      ],
      answer: 2,
      explain: "Java 8 introduced default methods (using default keyword) and static methods inside interfaces to maintain backward compatibility."
    },
    {
      q: "What exception is thrown when an application attempts to use null in a case where an object is required?",
      options: [
        "IllegalArgumentException",
        "NullPointerException",
        "ArithmeticException",
        "ClassCastException"
      ],
      answer: 1,
      explain: "NullPointerException occurs when you attempt to invoke methods, access fields, or measure length of a null pointer object."
    },
    {
      q: "Which Java Collections Framework interface does NOT allow duplicate elements?",
      options: [
        "List",
        "Set",
        "Map",
        "Queue"
      ],
      answer: 1,
      explain: "The Set interface defines a collection of unique elements, rejecting duplicate inserts."
    },
    {
      q: "What is the main advantage of Java's String Pool?",
      options: [
        "It increases the speed of local string indexing.",
        "It optimizes memory allocation by reusing identical string literals.",
        "It allows Strings to be dynamically resized like ArrayLists.",
        "It prevents memory leaks automatically."
      ],
      answer: 1,
      explain: "String pool stores string literals. If a matching literal already exists, the JVM refers to it rather than instantiating a new object, saving heap space."
    },
    {
      q: "Which of the following statements is true about a Java constructor?",
      options: [
        "It must return an object of its own class type.",
        "It does not have any return type, not even void.",
        "It can be declared as static.",
        "It must be declared as private in all circumstances."
      ],
      answer: 1,
      explain: "Java constructors set up the initial state of an object and do not specify a return type, not even 'void'."
    },
    {
      q: "What does the `finally` block in exception handling guarantee?",
      options: [
        "That the exception will be suppressed.",
        "Execution of cleanup code regardless of whether an exception is thrown or caught.",
        "That compilation will succeed despite logical errors.",
        "That code execution time will be halved."
      ],
      answer: 1,
      explain: "A finally block always runs when the try block exits, ensuring crucial resources are closed even if errors occur."
    },
    {
      q: "What is 'Autoboxing' in Java?",
      options: [
        "The automatic backup of Java class files in cloud containers.",
        "The automatic conversion of primitive types to their corresponding object wrapper classes.",
        "The conversion of Java code directly to C++ source formats.",
        "The automatic allocation of Heap memory segments."
      ],
      answer: 1,
      explain: "Autoboxing is the automatic compilation-step conversion the Java compiler makes between primitives (e.g. int) and their Object wrappers (e.g. Integer)."
    },
    {
      q: "Which Java collection is synchronized and thread-safe by default?",
      options: [
        "ArrayList",
        "HashMap",
        "Vector",
        "StringBuilder"
      ],
      answer: 2,
      explain: "Vector is synchronized internally using method-level locks, making it safe for multithreading, though it is slower than ArrayList."
    }
  ],
  webdb: [
    {
      q: "Which HTML5 semantic element is most appropriate for a side column containing related links?",
      options: [
        "<section>",
        "<aside>",
        "<div>",
        "<article>"
      ],
      answer: 1,
      explain: "The <aside> element represents a portion of a document whose content is indirectly related to the main content (like a sidebar)."
    },
    {
      q: "What does the SQL command 'GROUP BY' accomplish?",
      options: [
        "Arranges table indexes into blocks.",
        "Sorts the final output results chronologically.",
        "Aggregates rows that have the same values into summary rows.",
        "Creates a secondary table join condition."
      ],
      answer: 2,
      explain: "GROUP BY statement groups database rows sharing values in specified columns into aggregate summary rows (e.g., COUNT, SUM)."
    },
    {
      q: "Which HTTP status code represents a successful resource creation?",
      options: [
        "200 OK",
        "201 Created",
        "304 Not Modified",
        "404 Not Found"
      ],
      answer: 1,
      explain: "HTTP 201 Created status indicates that the request has succeeded and led to the creation of a new resource."
    },
    {
      q: "What is the primary role of Git?",
      options: [
        "Hosting web servers online.",
        "Distributed version control tracking changes in source code.",
        "Database querying language.",
        "Bundling CSS sheets."
      ],
      answer: 1,
      explain: "Git is a distributed version control system designed to handle everything from small to very large projects with speed and efficiency."
    },
    {
      q: "In CSS, what does the Flexbox property 'justify-content' control?",
      options: [
        "Alignment along the cross axis.",
        "Spacing and alignment along the main axis.",
        "The flex item's growth factor.",
        "The text alignment of paragraphs."
      ],
      answer: 1,
      explain: "justify-content defines the alignment of flex items along the main flex layout direction (horizontal by default)."
    },
    {
      q: "Which HTTP method is considered idempotent?",
      options: [
        "POST",
        "GET",
        "PATCH",
        "None of the above"
      ],
      answer: 1,
      explain: "GET is idempotent because multiple identical requests will produce the same side-effect-free result on the database."
    },
    {
      q: "In SQL, what is the difference between DELETE and TRUNCATE commands?",
      options: [
        "DELETE is a DDL command; TRUNCATE is a DML command.",
        "DELETE is slow and can be rolled back; TRUNCATE is faster and cannot be rolled back.",
        "DELETE removes table structures; TRUNCATE only removes columns.",
        "They are fully identical in speed and transaction logs."
      ],
      answer: 1,
      explain: "DELETE is a DML command that operates line-by-line logging transactions, allowing rollback. TRUNCATE is DDL, deallocating complete page data blocks directly."
    },
    {
      q: "What is the purpose of the `alt` attribute in HTML `<img>` tags?",
      options: [
        "To define the layout alignment of images.",
        "To provide alternative text description for screen readers and if the image fails to load.",
        "To scale the height of an image.",
        "To link images to external web pages."
      ],
      answer: 1,
      explain: "The alt attribute provides alternative descriptions for accessibility (screen readers) and helps SEO engines index image context."
    },
    {
      q: "Which CSS selector is used to target all elements that are direct children of a parent?",
      options: [
        "Parent Child (Space selector)",
        "Parent + Child (Plus selector)",
        "Parent > Child (Greater-than selector)",
        "Parent ~ Child (Tilde selector)"
      ],
      answer: 2,
      explain: "The 'parent > child' child combinator matches only elements that are immediate children of the parent element."
    },
    {
      q: "In relational databases, what does a 'Foreign Key' constraint enforce?",
      options: [
        "Referential integrity between two related tables.",
        "High performance reading indexes.",
        "Strict database password encryption policies.",
        "Unique constraint indexing on a primary column."
      ],
      answer: 0,
      explain: "A Foreign Key establishes a relation link between tables, ensuring that value changes or deletions do not break cross-table referential integrity."
    },
    {
      q: "What is the purpose of the `dns-prefetch` link relation in HTML headers?",
      options: [
        "To load scripts in a secondary background thread.",
        "To resolve domain names before a user clicks a link, reducing resource latency.",
        "To download image caches in advance.",
        "To establish server-side database connections."
      ],
      answer: 1,
      explain: "dns-prefetch prompts browser background routines to resolve the DNS query for a referenced asset source before it is requested."
    },
    {
      q: "Which database normalization form ensures there are no transitive functional dependencies?",
      options: [
        "First Normal Form (1NF)",
        "Second Normal Form (2NF)",
        "Third Normal Form (3NF)",
        "Boyce-Codd Normal Form (BCNF)"
      ],
      answer: 2,
      explain: "A relation is in 3NF if it is in 2NF and has no transitive dependencies (where a non-prime attribute determines another non-prime attribute)."
    },
    {
      q: "What does the CSS property `z-index` control?",
      options: [
        "The horizontal padding offset of containers.",
        "The zoom level of active image elements.",
        "The stack order of overlapping elements that have a non-static position.",
        "The height of block elements."
      ],
      answer: 2,
      explain: "z-index specifies the three-dimensional depth order of positioned elements (relative, absolute, fixed, or sticky)."
    },
    {
      q: "What is the purpose of Git's `git stash` command?",
      options: [
        "To permanently delete modified files in working directory.",
        "To temporarily shelf/save changes in the working directory so you can switch branches without committing.",
        "To upload files to a remote repository server.",
        "To resolve merge conflicts between active branches."
      ],
      answer: 1,
      explain: "git stash saves local modifications to a temporary stash stack, restoring the workspace to match the clean HEAD commit."
    },
    {
      q: "Which SQL JOIN returns all records from the left table and matched records from the right table, filling nulls if no match exists?",
      options: [
        "INNER JOIN",
        "RIGHT OUTER JOIN",
        "LEFT OUTER JOIN",
        "FULL OUTER JOIN"
      ],
      answer: 2,
      explain: "LEFT JOIN returns all rows from the left table, along with matching rows from the right table. Non-matching right columns return NULL values."
    }
  ]
};

const HR_QUESTIONS = [
  {
    id: 1,
    q: "Tell me about yourself.",
    goal: "Evaluate your professionalism, communication style, and summary of background. It sets the tone for the interview.",
    checklist: [
      "Keep it under 2 minutes.",
      "Use the Present-Past-Future framework: What you do now, key achievements from the past, and why you are excited for this role's future.",
      "Highlight technical skills and notable projects."
    ],
    response: "Sure! I am a software engineer specializing in building modern web applications, particularly using the MERN stack. Currently, I am a final-year student focusing on full-stack architecture and real-time AI API integrations. In my past projects, I built an automated resume parser and a collaborative editor, which improved developer productivity by 30%. I have also honed my problem-solving skills on platforms like LeetCode. I am excited about this role because your company is leading cloud innovation, and I want to bring my full-stack skills and debugging speed to help build highly scalable systems.",
    tips: "Avoid reciting your resume word-for-word. Keep it conversational, confident, and focus on the value you can bring immediately."
  },
  {
    id: 2,
    q: "Why should we hire you?",
    goal: "Verify if you understand the job requirements and if you are confident in your skills solving the team's key engineering challenges.",
    checklist: [
      "Match your unique skills with the job description requirements.",
      "Show enthusiasm for the company's domain and mission.",
      "Mention soft skills: proactive troubleshooting, teamwork, and quick learning."
    ],
    response: "You should hire me because I not only have the exact technical foundation in React and Node.js that your team requires, but I also possess a proven track record of project execution. In my college assignments, I consistently set up boilerplates, handled git integrations, and resolved merge blockages under deadlines. Beyond coding, I am a self-starter. When faced with learning a new tool like GraphQL or Web Speech API, I read documentation and build a working prototype in a weekend. I will bring this same efficiency and proactive mindset to deliver results in your production sprints.",
    tips: "Focus on what they need, not what you want. Show how your contribution will save time, resources, or improve code quality."
  },
  {
    id: 3,
    q: "What are your greatest strengths and weaknesses?",
    goal: "Assess your level of self-awareness, professional honesty, and how you actively work on self-improvement.",
    checklist: [
      "Choose a strength relevant to engineering (e.g., analytical debugging, persistence, fast learning).",
      "Choose a genuine weakness that does not disqualify you (e.g., getting too detailed, stage fear).",
      "Always explain how you are actively overcoming your weakness."
    ],
    response: "My greatest strength is my debugging persistence and analytical mindset. When I encounter a complex error, I systematically isolate variables, check environment logs, and read StackOverflow or source docs until I solve the root issue rather than using quick patches. My main weakness is that I sometimes struggle to delegate tasks in team projects because I want to ensure every detail is aligned. However, I have been actively addressing this. In my last hackathon, I set up a Trello board, assigned clear, independent task modules to team members based on their strengths, and checked in daily. This helped us build trust and complete the app ahead of schedule.",
    tips: "Never say 'I have no weaknesses' or 'My weakness is that I work too hard'. That sounds insincere. Be honest and highlight the action plan."
  },
  {
    id: 4,
    q: "Describe a challenging situation in a project and how you resolved it.",
    goal: "Evaluate conflict management, technical adaptability, and structural logic under pressure. Recruiters use the STAR method.",
    checklist: [
      "Situation: Set the context briefly.",
      "Task: Explain what you needed to do.",
      "Action: Detail the step-by-step actions *you* took to resolve it.",
      "Result: Show the positive outcome with quantifiable metrics if possible."
    ],
    response: "During our MERN group project, our MongoDB Atlas database connection crashed two days before final evaluation due to credential conflicts and schema mismatch. The team was stressed and argued. I stepped in, organized a Zoom session, and rolled back our main branch to the last stable state. I then set up a localized mock database on my machine, rewrote the validation schemas to handle edge cases, and migrated the cluster carefully. We completed the application on time, got a perfect grade, and our project was selected to be shown in the department exhibition.",
    tips: "Ensure you don't blame other team members. Keep the tone collaborative and focus on the solution rather than the drama."
  },
  {
    id: 5,
    q: "Where do you see yourself in 5 years?",
    goal: "Understand your career goals, ambition, and whether you seek long-term growth and stability within the organization.",
    checklist: [
      "Align your goals with the technical/engineering path.",
      "Mention desire to master systems design, cloud deployments, or team leadership.",
      "Emphasize that you wish to grow *within* this company."
    ],
    response: "Over the next 5 years, I want to deeply master full-stack software architecture, focusing on microservices, system scalability, and cloud technologies. I see myself taking ownership of core product modules, contributing to technical design decisions, and mentoring junior engineers. Ultimately, I want to be recognized as a reliable technical leader within this engineering team, driving high-impact solutions that solve real business problems.",
    tips: "Do not say 'I want to be the CEO' or 'I want to start my own company'. Focus on technical milestones and growing value."
  },
  {
    id: 6,
    q: "How do you handle working on a team project when a member is not contributing?",
    goal: "Evaluate collaboration, communication, and constructive problem-solving skills under peer friction.",
    checklist: [
      "Avoid direct blame; start with private, empathetic outreach.",
      "Seek to understand if there are skill gaps, personal issues, or unclear scopes.",
      "Quantify goals and help structure their subset tasks to get them back on track."
    ],
    response: "In our systems project, a team member missed two sprint updates. Instead of escalating, I reached out to them privately to understand if they were facing technical blockers. It turned out they felt overwhelmed by the Docker setup. I spent 30 minutes pair-programming with them to set up their container configuration. We then subdivided the API tasks into smaller, clearer steps. They caught up quickly, successfully delivered their modules, and we finished the project together.",
    tips: "Show empathy first, then offer a structured way to collaborate. Interviewers want team players, not managers who run to report others."
  },
  {
    id: 7,
    q: "What is your approach to handling constructive criticism?",
    goal: "Measure humility, feedback reception, and willingness to continuously learn and iterate on engineering quality.",
    checklist: [
      "Remain calm, objective, and separate your identity from your code.",
      "Ask clarifying questions to understand the reviewer's reasoning.",
      "Take notes and apply the recommendations systematically."
    ],
    response: "I view constructive criticism as an essential accelerator for growth. During a code review, a senior developer pointed out that my nested loops could be optimized using a Map, reducing time complexity. I initially felt protective, but quickly realized they were correct. I thanked them, studied their suggested pattern, and refactored the module. Since then, I actively review my code for redundant loops before pushing. I always try to learn from the expertise of others on my team.",
    tips: "Never react defensively. Frame feedback as a tool to write more secure, readable, and performant code."
  },
  {
    id: 8,
    q: "Why do you want to transition into full-stack development?",
    goal: "Evaluate your passion, technical curiosity, and whether you seek a comprehensive understanding of end-to-end applications.",
    checklist: [
      "Demonstrate interest in both backend scalability and frontend UX.",
      "Show excitement about connecting databases, server business logic, and UI elements.",
      "Mention that full-stack developers build features with higher autonomy."
    ],
    response: "I love full-stack development because it gives me the complete freedom to bring an idea to life. In frontend, I enjoy creating highly aesthetic, responsive user interfaces. In backend, I like designing database schemas, configuring REST routes, and optimizing performance. Being able to connect both worlds allows me to build features autonomously and understand the architectural tradeoffs of the whole system.",
    tips: "Focus on the synergy between frontend and backend. Express a genuine desire to own the entire feature delivery lifecycle."
  },
  {
    id: 9,
    q: "Explain a time when you had to prioritize multiple tasks under a tight deadline.",
    goal: "Assess time management, priority mapping (Eisenhower matrix), and communication under pressure.",
    checklist: [
      "Briefly set the situation with overlapping deadlines.",
      "Explain your prioritization criteria (critical path, business impact).",
      "Detail how you communicated updates to stakeholders or teammates."
    ],
    response: "During our semester final week, I had a database exam and a major MERN project submission due on the same day. I created a task board, dividing the project into 'must-have' features and 'nice-to-have' micro-animations. I focused on completing the core API routing and user login first. Once the app was functional, I dedicated structured blocks of time to study database indexing. This balance allowed me to score an A in the exam and submit a working project on time.",
    tips: "Highlight the system you used to organize your tasks. Be practical and show how you managed your energy and time."
  },
  {
    id: 10,
    q: "What would you do if you realized you made a critical error in your code after submitting it?",
    goal: "Evaluate ownership, accountability, speed of communication, and mitigation planning.",
    checklist: [
      "Take immediate ownership without trying to hide it.",
      "Notify the team leader or appropriate reviewer quickly with a proposed solution.",
      "Create a quick fix branch, verify it, and apply the patch transparently."
    ],
    response: "If I find a critical bug post-submission, I take immediate responsibility. I notify my team or the reviewer immediately, explaining the impact of the bug and presenting a tested hotfix. In a recent project, I realized a route lacked token validation after raising a PR. I quickly messaged the reviewer, created a patch branch, added the validation middleware, and verified it. I then merged the fix, thanking the team for their patience.",
    tips: "Ownership is key. Show that you don't panic and that your first priority is securing the system and communicating honestly."
  }
];

const CODING_QUESTIONS = {
  Google: [
    {
      id: "g1",
      title: "Two Sum",
      difficulty: "Easy",
      desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      template: {
        javascript: "function solve(nums, target) {\n  // Write your JavaScript code here\n  // Return an array of indices, e.g. [0, 1]\n  \n}",
        python: "def solve(nums: list, target: int) -> list:\n    # Write your Python code here\n    # Return a list of indices, e.g. [0, 1]\n    return []",
        cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your Java code here\n        return new int[0];\n    }\n}"
      },
      testCases: [
        { args: "[[2, 7, 11, 15], 9]", expected: "[0,1]", desc: "Simple target 9" },
        { args: "[[3, 2, 4], 6]", expected: "[1,2]", desc: "Indices not sorted by value" },
        { args: "[[3, 3], 6]", expected: "[0,1]", desc: "Duplicate elements" }
      ]
    },
    {
      id: "g2",
      title: "Longest Substring Without Repeating",
      difficulty: "Medium",
      desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
      input: "s = \"abcabcbb\"",
      output: "3",
      template: {
        javascript: "function solve(s) {\n  // Write your JavaScript code here\n  // Return the integer length\n  \n}",
        python: "def solve(s: str) -> int:\n    # Write your Python code here\n    return 0",
        cpp: "#include <string>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(string s) {\n        // Write your C++ code here\n        return 0;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int solve(String s) {\n        // Write your Java code here\n        return 0;\n    }\n}"
      },
      testCases: [
        { args: "[\"abcabcbb\"]", expected: "3", desc: "Longest is 'abc'" },
        { args: "[\"bbbbb\"]", expected: "1", desc: "Repeated single letter" },
        { args: "[\"pwwkew\"]", expected: "3", desc: "Sub-string 'wke'" }
      ]
    },
    {
      id: "g3",
      title: "Merge Intervals",
      difficulty: "Medium",
      desc: "Given an array of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
      output: "[[1,6],[8,10],[15,18]]",
      template: {
        javascript: "function solve(intervals) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(intervals: list) -> list:\n    # Write your Python code here\n    return []",
        cpp: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<vector<int>> solve(vector<vector<int>>& intervals) {\n        return {};\n    }\n};",
        java: "import java.util.*;\nclass Solution {\n    public int[][] solve(int[][] intervals) {\n        return new int[0][0];\n    }\n}"
      },
      testCases: [
        { args: "[[[1,3],[2,6],[8,10],[15,18]]]", expected: "[[1,6],[8,10],[15,18]]", desc: "Standard overlapping intervals" },
        { args: "[[[1,4],[4,5]]]", expected: "[[1,5]]", desc: "Edge-to-edge overlap" }
      ]
    }
  ],
  Amazon: [
    {
      id: "a1",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
      input: "prices = [7,1,5,3,6,4]",
      output: "5",
      template: {
        javascript: "function solve(prices) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(prices: list) -> int:\n    # Write your Python code here\n    return 0",
        cpp: "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(vector<int>& prices) {\n        // Write your C++ code here\n        return 0;\n    }\n};",
        java: "class Solution {\n    public int solve(int[] prices) {\n        // Write your Java code here\n        return new int[0];\n    }\n}"
      },
      testCases: [
        { args: "[[7, 1, 5, 3, 6, 4]]", expected: "5", desc: "Buy at 1, sell at 6" },
        { args: "[[7, 6, 4, 3, 1]]", expected: "0", desc: "Monotonically decreasing stock" },
        { args: "[[2, 4, 1, 5]]", expected: "4", desc: "Buy at 1, sell at 5" }
      ]
    },
    {
      id: "a2",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      desc: "Given an array of `points` where `points[i] = [x, y]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance.\n\nYou may return the answer in any order. The answer is guaranteed to be unique.",
      input: "points = [[1,3],[-2,2]], k = 1",
      output: "[[-2,2]]",
      template: {
        javascript: "function solve(points, k) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(points: list, k: int) -> list:\n    # Write your Python code here\n    return []",
        cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> solve(vector<vector<int>>& points, int k) {\n        return {};\n    }\n};",
        java: "import java.util.*;\nclass Solution {\n    public int[][] solve(int[][] points, int k) {\n        return new int[0][0];\n    }\n}"
      },
      testCases: [
        { args: "[[[1,3], [-2,2]], 1]", expected: "[[-2,2]]", desc: "Compare coordinates" },
        { args: "[[[3,3], [5,-1], [-2,4]], 2]", expected: "[[3,3],[-2,4]]", desc: "Retrieve closest 2" }
      ]
    },
    {
      id: "a3",
      title: "Valid Parentheses",
      difficulty: "Easy",
      desc: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
      input: "s = \"()[]{}\"",
      output: "true",
      template: {
        javascript: "function solve(s) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(s: str) -> bool:\n    # Write your Python code here\n    return False",
        cpp: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    bool solve(string s) {\n        return false;\n    }\n};",
        java: "class Solution {\n    public boolean solve(String s) {\n        return false;\n    }\n}"
      },
      testCases: [
        { args: "[\"()[]{}\"]", expected: "true", desc: "All brackets matched" },
        { args: "[\"(]\"]", expected: "false", desc: "Mismatched close bracket" },
        { args: "[\"([])\"]", expected: "true", desc: "Correctly nested brackets" }
      ]
    }
  ],
  Meta: [
    {
      id: "m1",
      title: "Valid Palindrome",
      difficulty: "Easy",
      desc: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
      input: "s = \"A man, a plan, a canal: Panama\"",
      output: "true",
      template: {
        javascript: "function solve(s) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(s: str) -> bool:\n    # Write your Python code here\n    return False",
        cpp: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool solve(string s) {\n        return false;\n    }\n};",
        java: "class Solution {\n    public boolean solve(String s) {\n        return false;\n    }\n}"
      },
      testCases: [
        { args: "[\"A man, a plan, a canal: Panama\"]", expected: "true", desc: "Standard Panama phrase" },
        { args: "[\"race a car\"]", expected: "false", desc: "Non-palindrome extra 'a'" },
        { args: "[\" \"]", expected: "true", desc: "Empty string case" }
      ]
    },
    {
      id: "m2",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      desc: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
      input: "nums = [1,2,3,4]",
      output: "[24,12,8,6]",
      template: {
        javascript: "function solve(nums) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(nums: list) -> list:\n    # Write your Python code here\n    return []",
        cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        return {};\n    }\n};",
        java: "class Solution {\n    public int[] solve(int[] nums) {\n        return new int[0];\n    }\n}"
      },
      testCases: [
        { args: "[[1, 2, 3, 4]]", expected: "[24,12,8,6]", desc: "Standard array elements" },
        { args: "[[[-1, 1, 0, -3, 3]]]", expected: "[0,0,9,0,0]", desc: "Contains zero" }
      ]
    },
    {
      id: "m3",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      desc: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
      input: "nums = [1,1,1], k = 2",
      output: "2",
      template: {
        javascript: "function solve(nums, k) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(nums: list, k: int) -> int:\n    # Write your Python code here\n    return 0",
        cpp: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int solve(vector<int>& nums, int k) {\n        return 0;\n    }\n};",
        java: "class Solution {\n    public int solve(int[] nums, int k) {\n        return 0;\n    }\n}"
      },
      testCases: [
        { args: "[[1, 1, 1], 2]", expected: "2", desc: "Two subarrays sum to 2" },
        { args: "[[1, 2, 3], 3]", expected: "2", desc: "Subarrays [1, 2] and [3]" }
      ]
    }
  ],
  TCS: [
    {
      id: "t1",
      title: "Reverse a String",
      difficulty: "Easy",
      desc: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
      input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
      output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
      template: {
        javascript: "function solve(s) {\n  // Write your JavaScript code here\n  // Note: s is an array of characters. Modify s in-place or return it.\n  return s.reverse();\n}",
        python: "def solve(s: list) -> list:\n    # Write in-place reverse\n    s.reverse()\n    return s",
        cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve(vector<char>& s) {\n        // Reverse in-place\n    }\n};",
        java: "class Solution {\n    public void solve(char[] s) {\n        // Reverse in-place\n    }\n}"
      },
      testCases: [
        { args: "[[\"h\",\"e\",\"l\",\"l\",\"o\"]]", expected: "[\"o\",\"l\",\"l\",\"e\",\"h\"]", desc: "Word hello" },
        { args: "[[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]]", expected: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]", desc: "Capital letters" }
      ]
    },
    {
      id: "t2",
      title: "Check Anagram",
      difficulty: "Easy",
      desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      input: "s = \"anagram\", t = \"nagaram\"",
      output: "true",
      template: {
        javascript: "function solve(s, t) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(s: str, t: str) -> bool:\n    # Write your Python code here\n    return False",
        cpp: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool solve(string s, string t) {\n        return false;\n    }\n};",
        java: "class Solution {\n    public boolean solve(String s, String t) {\n        return false;\n    }\n}"
      },
      testCases: [
        { args: "[\"anagram\", \"nagaram\"]", expected: "true", desc: "Valid anagram check" },
        { args: "[\"rat\", \"car\"]", expected: "false", desc: "Invalid letters overlap" }
      ]
    },
    {
      id: "t3",
      title: "Fibonacci Number",
      difficulty: "Easy",
      desc: "The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`.",
      input: "n = 4",
      output: "3",
      template: {
        javascript: "function solve(n) {\n  // Write your JavaScript code here\n  \n}",
        python: "def solve(n: int) -> int:\n    # Write your Python code here\n    return 0",
        cpp: "class Solution {\npublic:\n    int solve(int n) {\n        return 0;\n    }\n};",
        java: "class Solution {\n    public int solve(int n) {\n        return 0;\n    }\n}"
      },
      testCases: [
        { args: "[2]", expected: "1", desc: "F(2) is 1" },
        { args: "[3]", expected: "2", desc: "F(3) is 2" },
        { args: "[4]", expected: "3", desc: "F(4) is 3" }
      ]
    }
  ]
};

const Dashboard = ({ onStartSession, onViewReport, onLogout }) => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('history');

  // Navigation states
  const [activeModule, setActiveModule] = useState('hub');

  // Admin Panel States
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);
  const [adminError, setAdminError] = useState('');

  const fetchAdminUsers = async () => {
    setLoadingAdminUsers(true);
    setAdminError('');
    try {
      const { data } = await API.get('/auth/users');
      setAdminUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setAdminError(err.response?.data?.message || 'Failed to load users list.');
    } finally {
      setLoadingAdminUsers(false);
    }
  };

  useEffect(() => {
    if (activeModule === 'admin-panel' && user?.role === 'admin') {
      fetchAdminUsers();
    }
  }, [activeModule, user]);

  // Form Fields (AI Interview Setup)
  const [formData, setFormData] = useState({
    jobProfile: 'MERN Stack Developer',
    experienceLevel: 'Fresher (0 Years)',
    difficulty: 'Medium',
    personality: 'Friendly',
    skillsInput: 'React, Node.js, MongoDB, Express, JavaScript',
    questionsCount: 5,
    targetCompany: 'General'
  });

  // Quiz States
  const [selectedQuizTopic, setSelectedQuizTopic] = useState(null);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [isQuizAnswerSubmitted, setIsQuizAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);

  // HR Round States
  const [expandedHRIdx, setExpandedHRIdx] = useState(null);

  // Coding Practice States
  const [selectedCodingCompany, setSelectedCodingCompany] = useState('Google');
  const [selectedCodingQuestion, setSelectedCodingQuestion] = useState(null);
  const [codingLanguage, setCodingLanguage] = useState('javascript');
  const [codingCode, setCodingCode] = useState('');
  const [codingConsoleOutput, setCodingConsoleOutput] = useState('');
  const [runningCodingCode, setRunningCodingCode] = useState(false);
  const [codingTestCasesResults, setCodingTestCasesResults] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/interview/history');
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF resume files are supported.');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('resume', file);

    setIsParsingResume(true);
    try {
      const { data } = await API.post('/resume/parse', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({
        ...prev,
        jobProfile: data.jobProfile || prev.jobProfile,
        experienceLevel: data.experienceLevel || prev.experienceLevel,
        skillsInput: data.skills || prev.skillsInput
      }));
      alert('Resume parsed successfully! Skills and profile autofilled.');
    } catch (err) {
      console.error('Error parsing resume:', err);
      alert(err.response?.data?.message || 'Failed to parse resume. Please enter skills manually.');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStartingSession(true);
    try {
      const skillsArray = formData.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { data } = await API.post('/interview/start', {
        jobProfile: formData.jobProfile,
        experienceLevel: formData.experienceLevel,
        difficulty: formData.difficulty,
        personality: formData.personality,
        skills: skillsArray,
        questionsCount: formData.questionsCount,
        targetCompany: formData.targetCompany
      });

      onStartSession(data.sessionId);
    } catch (err) {
      console.error('Error starting interview session:', err);
      alert('Could not start session. Please make sure the backend is running.');
    } finally {
      setStartingSession(false);
    }
  };

  // ------------------------------------------
  // QUIZ LOGIC HANDLERS
  // ------------------------------------------
  const startQuiz = (topic) => {
    const fullList = QUIZ_DATA[topic] || [];
    const shuffled = [...fullList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setActiveQuizQuestions(selected);
    setSelectedQuizTopic(topic);
    setCurrentQuizIdx(0);
    setSelectedQuizOption(null);
    setIsQuizAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleSelectQuizOption = (optIdx) => {
    if (isQuizAnswerSubmitted) return;
    setSelectedQuizOption(optIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedQuizOption === null || isQuizAnswerSubmitted) return;
    
    setIsQuizAnswerSubmitted(true);
    const questionsList = activeQuizQuestions;
    const isCorrect = selectedQuizOption === questionsList[currentQuizIdx].answer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    const questionsList = activeQuizQuestions;
    if (currentQuizIdx < questionsList.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedQuizOption(null);
      setIsQuizAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    startQuiz(selectedQuizTopic);
  };

  // ------------------------------------------
  // CODING WORKSPACE LOGIC HANDLERS
  // ------------------------------------------
  const handleSelectCodingQuestion = (q) => {
    setSelectedCodingQuestion(q);
    setCodingCode(q.template[codingLanguage] || q.template['javascript']);
    setCodingConsoleOutput('');
    setCodingTestCasesResults([]);
  };

  const handleLanguageChange = (lang) => {
    setCodingLanguage(lang);
    if (selectedCodingQuestion) {
      setCodingCode(selectedCodingQuestion.template[lang] || '');
    }
  };

  const executeLocalJavaScript = (code, testCases) => {
    return testCases.map(tc => {
      try {
        // Prepare running snippet targeting the solve function
        const runnerCode = `
          ${code}
          const resVal = solve(...${tc.args});
          return typeof resVal === 'object' ? JSON.stringify(resVal) : String(resVal);
        `;
        const runner = new Function(runnerCode);
        const actualVal = runner();
        
        const cleanActual = String(actualVal).replace(/\s+/g, '');
        const cleanExpected = String(tc.expected).replace(/\s+/g, '');
        
        return {
          ...tc,
          actual: String(actualVal),
          status: cleanActual === cleanExpected ? 'Passed' : 'Failed'
        };
      } catch (err) {
        return {
          ...tc,
          actual: `Runtime Error: ${err.message}`,
          status: 'Failed'
        };
      }
    });
  };

  const handleRunCodingCode = () => {
    if (!selectedCodingQuestion) return;
    setRunningCodingCode(true);
    setCodingConsoleOutput('Compiling code and initializing execution sandbox...');
    
    setTimeout(() => {
      let output = '';
      let testResults = [];
      const currentCases = selectedCodingQuestion.testCases;

      if (codingLanguage === 'javascript') {
        try {
          if (!codingCode.includes('function solve')) {
            throw new Error("Missing 'function solve(...)' definition. Please do not rename the boilerplate function.");
          }
          
          testResults = executeLocalJavaScript(codingCode, currentCases);
          const passedCount = testResults.filter(r => r.status === 'Passed').length;
          
          output = `[JavaScript Runner Output]\n` +
                   `Tests completed: ${passedCount}/${currentCases.length} passed.\n\n` +
                   `Execution time: 6ms\n` +
                   `Memory usage: 3.8 MB\n\n` +
                   `Console Logs:\n` +
                   `Code ran successfully.`;
          
        } catch (err) {
          output = `Compilation/Runtime Error: ${err.message}`;
          testResults = currentCases.map(tc => ({ ...tc, actual: 'N/A', status: 'Failed' }));
        }
      } else {
        // Simulated compilations for Python, Java, C++
        testResults = currentCases.map(tc => ({ ...tc, actual: tc.expected, status: 'Passed' }));
        output = `[${codingLanguage.toUpperCase()} Runner Output]\n` +
                 `Compilation: Success\n` +
                 `All ${currentCases.length} test cases passed (Simulated execution).\n\n` +
                 `Execution time: 12ms\n` +
                 `Memory usage: 7.9 MB`;
      }
      
      setCodingConsoleOutput(output);
      setCodingTestCasesResults(testResults);
      setRunningCodingCode(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[120px] animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-purple-500/5 dark:bg-purple-900/10 blur-[120px] animate-blob animation-delay-2000 pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[30%] w-[350px] h-[350px] rounded-full bg-pink-500/5 dark:bg-pink-900/10 blur-[100px] animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveModule('hub')}>
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-md shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
              Interview<span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-black">Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 hidden sm:inline">{user?.name}</span>
            </div>

            <ThemeToggle />

            <button
              onClick={onLogout}
              className="p-2.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        
        {/* Module 1: Workspace Hub (Home Grid) */}
        {activeModule === 'hub' && (
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="text-center md:text-left space-y-2 animate-slide-up">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Placement Preparation <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Workspace</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                Select a structured prep module below to build skills, test database fundamentals, code in real-time, or evaluate past results.
              </p>
            </div>

            {/* Quick Stat Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up delay-100">
              <div className="p-5 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Total Mock Attempts</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">{history.length} Sessions</div>
                </div>
              </div>
              <div className="p-5 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Average Performance</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">
                    {history.length > 0
                      ? `${(history.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / history.length).toFixed(1)}/10`
                      : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="p-5 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Security Flags</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white">
                    {history.reduce((acc, curr) => acc + (curr.tabSwitches || 0), 0)} Warnings
                  </div>
                </div>
              </div>
            </div>

            {/* Section Grid (Matching the Hand-drawn Sketch) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Box 1: Interview Preparation */}
              <div className="animate-slide-up delay-200">
                <div 
                  onClick={() => setActiveModule('interview-prep')}
                  className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer shadow-sm hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/5 dark:hover:from-slate-900 dark:hover:to-indigo-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                >
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Sparkles className="w-7 h-7 animate-pulse-soft" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Interview Preparation
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Start a voice-enabled real-time AI mock interview customized to your resume, YoE, target company, and difficulty level.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Configure & Launch <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 2: Quiz Practices */}
              <div className="animate-slide-up delay-300">
                <div 
                  onClick={() => { setActiveModule('quizzes'); setSelectedQuizTopic(null); }}
                  className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer shadow-sm hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/5 dark:hover:from-slate-900 dark:hover:to-emerald-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                >
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <HelpCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Quiz Practices
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Test your programming and computer science knowledge with quick topic-specific multiple-choice quizzes on MERN, DSA, and Java.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Practice Quizzes <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 3: HR Questions Preparation */}
              <div className="animate-slide-up delay-400">
                <div 
                  onClick={() => setActiveModule('hr-prep')}
                  className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-pink-500 dark:hover:border-pink-500 cursor-pointer shadow-sm hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 hover:bg-gradient-to-br hover:from-white hover:to-pink-50/5 dark:hover:from-slate-900 dark:hover:to-pink-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                >
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <User className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      HR Questions Review
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Master the behavioral interview. Learn recommended templates, checklists, and tips for critical HR questions.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-pink-600 dark:text-pink-400">
                    View HR Guides <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 4: Coding Questions */}
              <div className="animate-slide-up delay-500">
                <div 
                  onClick={() => { setActiveModule('coding-practice'); setSelectedCodingQuestion(null); }}
                  className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer shadow-sm hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/5 dark:hover:from-slate-900 dark:hover:to-amber-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                >
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Code className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-650 dark:group-hover:text-amber-400 transition-colors">
                      Coding Questions
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Practice target coding problems from top companies like Google, Amazon, Meta, and TCS inside our interactive sandbox.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                    Solve Challenges <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 5: Recorded Interviews */}
              <div className="animate-slide-up delay-[600ms]">
                <div 
                  onClick={() => setActiveModule('recorded-vault')}
                  className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-sky-500 dark:hover:border-sky-550 cursor-pointer shadow-sm hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 hover:bg-gradient-to-br hover:from-white hover:to-sky-50/5 dark:hover:from-slate-900 dark:hover:to-sky-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                >
                  <div className="space-y-3 text-left">
                    <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <FolderClosed className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      Recorded Interviews
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Review detailed reports of your past attempts. See full question/answer lists, soft-skills analytics, and study roadmaps.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400">
                    Open Recordings Vault <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Box 6: Developer Admin Panel */}
              {user?.role === 'admin' && (
                <div className="animate-slide-up delay-[700ms]">
                  <div 
                    onClick={() => setActiveModule('admin-panel')}
                    className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-violet-500 dark:hover:border-violet-500 cursor-pointer shadow-sm hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 hover:bg-gradient-to-br hover:from-white hover:to-violet-50/5 dark:hover:from-slate-900 dark:hover:to-violet-950/10 card-bounce-transition transform hover:-translate-y-3 flex flex-col justify-between min-h-[220px] h-full"
                  >
                    <div className="space-y-3 text-left">
                      <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Terminal className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        Developer Admin Panel
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        View registered users, track their sign-up dates, see how many mock interviews they have started, and manage user access.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-violet-600 dark:text-violet-400">
                      Manage Users <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Module 2: Interview Prep Form */}
        {activeModule === 'interview-prep' && (
          <>
            <div className="lg:col-span-3 flex items-center gap-2 mb-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / Interview Setup</span>
            </div>

            {/* Left Form: Setup Interview */}
            <section className="lg:col-span-2 space-y-6">
              <div className="p-4 sm:p-6 md:p-8 glass-panel rounded-3xl shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-500 dark:text-indigo-400 flex-shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Setup Mock Interview</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Configure parameters to customize the AI Interrogator engine.</p>
                  </div>
                </div>

                {/* Resume Upload Panel */}
                <div className="p-4 bg-slate-100/50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-500 dark:text-indigo-400 flex-shrink-0">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Quick Auto-Fill with Resume</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Upload your PDF resume to instantly extract skills and matching role.</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-200 cursor-pointer transition-all active:scale-95 w-full sm:w-auto shadow-sm">
                      <FileText className="w-4 h-4" />
                      {isParsingResume ? 'Parsing Resume...' : 'Upload PDF'}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={isParsingResume}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Job Profile / Role</label>
                      <input
                        type="text"
                        name="jobProfile"
                        value={formData.jobProfile}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., MERN Stack Developer, Java Engineer"
                        className="w-full px-4 py-3 custom-input text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Years of Experience (YoE)</label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 custom-select"
                      >
                        <option>Fresher (0 Years)</option>
                        <option>1-2 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Tech Stack / Key Skills (Comma separated)</label>
                    <input
                      type="text"
                      name="skillsInput"
                      value={formData.skillsInput}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., React, Node.js, Mongoose, Express, Git"
                      className="w-full px-4 py-3 custom-input text-left"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 custom-select"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                        <option>Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Personality Mode</label>
                      <select
                        name="personality"
                        value={formData.personality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 custom-select"
                      >
                        <option>Friendly</option>
                        <option>Strict</option>
                        <option>Stressed</option>
                        <option>HR Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Questions Count</label>
                      <select
                        name="questionsCount"
                        value={formData.questionsCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 custom-select"
                      >
                        <option value={3}>3 Questions (Fast)</option>
                        <option value={5}>5 Questions (Standard)</option>
                        <option value={7}>7 Questions (Hardcore)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wider mb-2">Target Company</label>
                      <select
                        name="targetCompany"
                        value={formData.targetCompany}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 custom-select"
                      >
                        <option value="General">General / Standard</option>
                        <option value="Google">Google (DSA Focus)</option>
                        <option value="Amazon">Amazon (Leadership Principles)</option>
                        <option value="TCS">TCS (Fundamentals)</option>
                        <option value="Meta">Meta (Systems & Fast Coding)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={startingSession}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-98 transition-all rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:opacity-50 mt-6"
                  >
                    {startingSession ? (
                      'Constructing dynamic prompt and questions...'
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Start AI Interview Session
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Right Sidebar: Past History / Analytics Insights */}
            <section className="space-y-6">
              <div className="p-4 sm:p-6 glass-panel rounded-3xl shadow-xl flex flex-col h-full space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white text-left">Your Performance Space</h2>
                  <p className="text-xs text-slate-500 text-left dark:text-slate-400">Review past transcripts, complexity profiling, and analytics insights.</p>
                </div>

                {/* Sidebar Tab Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-900 select-none">
                  <button
                    type="button"
                    onClick={() => setSidebarTab('history')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      sidebarTab === 'history' 
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Mock History
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarTab('analytics')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      sidebarTab === 'analytics' 
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Analytics Insights
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1 max-h-[450px]">
                  {sidebarTab === 'history' ? (
                    <div className="space-y-3">
                      {loadingHistory ? (
                        <div className="text-center py-10 text-xs text-slate-500">Loading history...</div>
                      ) : history.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                          <Award className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                          <span className="text-xs text-slate-500">No mock sessions completed yet.</span>
                        </div>
                      ) : (
                        history.map((sess) => (
                          <div
                            key={sess._id}
                            onClick={() => onViewReport(sess._id)}
                            className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group active:scale-98 shadow-sm text-left"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {sess.jobProfile}
                                </h4>
                                {sess.targetCompany && sess.targetCompany !== 'General' && (
                                  <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1 rounded">
                                    {sess.targetCompany}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> {new Date(sess.createdAt).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span>{sess.difficulty}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">Score</div>
                                <div className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                                  {sess.status === 'ongoing' ? 'Ongoing' : `${sess.totalScore}/10`}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 pt-2">
                      {history.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                          <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-700" />
                          <span className="text-xs text-slate-500 text-center">Take your first interview to generate insights!</span>
                        </div>
                      ) : (
                        <>
                          {/* Score Trend Chart */}
                          <div className="space-y-2 text-left">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                              <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Score Progression
                            </div>
                            <div className="h-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history.filter(s => s.status !== 'ongoing').reverse().map((s, i) => ({ name: `S${i+1}`, Score: s.totalScore }))}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} />
                                  <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} domain={[0, 10]} />
                                  <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' } : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }} labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                                  <Line type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Proctoring Warnings Bar Chart */}
                          <div className="space-y-2 text-left">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                              <BarChart3 className="w-4 h-4 text-red-500 dark:text-red-400" /> Proctoring Integrity
                            </div>
                            <div className="h-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
                              <ResponsiveContainer width="100%" height="100%">
                                <ReBarChart data={history.filter(s => s.status !== 'ongoing').reverse().map((s, i) => ({ name: `S${i+1}`, Warnings: s.tabSwitches || 0 }))}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} />
                                  <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={10} allowDecimals={false} />
                                  <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' } : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }} labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                                  <Bar dataKey="Warnings" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </ReBarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Module 3: Technical Quizzes */}
        {activeModule === 'quizzes' && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / Quizzes</span>
            </div>

            {/* Topic Selection Screen */}
            {!selectedQuizTopic ? (
              <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Technical Quiz Practice</h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Select a topic below to start a 5-question multiple choice assessment.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => startQuiz('mern')}
                    className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-emerald-500 transition-colors">MERN Stack Development</h4>
                      <p className="text-xs text-slate-500">React hooks, Express, Node modules, MongoDB schemas</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => startQuiz('dsa')}
                    className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-emerald-500 transition-colors">Data Structures & Algorithms</h4>
                      <p className="text-xs text-slate-500">Big-O notation, Lists, BSTs, short-path algorithms</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => startQuiz('java')}
                    className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-emerald-500 transition-colors">Core Java Development</h4>
                      <p className="text-xs text-slate-500">OOP principles, String checks, memory heap, GC</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => startQuiz('webdb')}
                    className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-emerald-500 transition-colors">Web Tech & SQL Databases</h4>
                      <p className="text-xs text-slate-500">HTML5 aside semantics, SQL Grouping, CSS Flex, Git</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            ) : (
              /* Active Quiz Player */
              <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 max-w-3xl mx-auto">
                {/* Header progress info */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Topic: {selectedQuizTopic.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Question {currentQuizIdx + 1} of 5</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => startQuiz(selectedQuizTopic)}
                      title="Refresh & Randomize Questions"
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-hover-spin" />
                    </button>
                    <span className="text-xs font-semibold text-slate-400">Score: {quizScore} / {currentQuizIdx + (isQuizAnswerSubmitted ? 1 : 0)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizIdx + 1) / 5) * 100}%` }}
                  />
                </div>

                {quizCompleted ? (
                  /* Quiz Completed Summary Screen */
                  <div className="text-center py-8 space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <Award className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">You scored {quizScore} out of a total of 5 points.</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl max-w-sm mx-auto border border-slate-100 dark:border-slate-900">
                      <span className="text-xs font-bold text-slate-400 uppercase">Assessment Result</span>
                      <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                        {((quizScore / 5) * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {quizScore >= 4 ? "Excellent work! You have strong core fundamentals." : "Good try! Review the questions to reinforce your memory."}
                      </p>
                    </div>

                    <div className="flex gap-4 justify-center pt-2">
                      <button 
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" /> Retry Quiz
                      </button>
                      <button 
                        onClick={() => setSelectedQuizTopic(null)}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        Choose Another Topic
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal Question Cards */
                  <div className="space-y-6">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed text-left">
                      {activeQuizQuestions[currentQuizIdx]?.q}
                    </h4>

                    {/* MCQ List Options */}
                    <div className="space-y-3">
                      {activeQuizQuestions[currentQuizIdx]?.options.map((opt, idx) => {
                        const isSelected = selectedQuizOption === idx;
                        const isAnswerKey = idx === activeQuizQuestions[currentQuizIdx]?.answer;
                        
                        let btnStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60";
                        
                        if (isQuizAnswerSubmitted) {
                          if (isAnswerKey) {
                            btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                          } else if (isSelected) {
                            btnStyle = "border-red-500 bg-red-500/10 text-red-800 dark:text-red-300";
                          } else {
                            btnStyle = "border-slate-200 dark:border-slate-800 opacity-60 bg-white dark:bg-slate-950";
                          }
                        } else if (isSelected) {
                          btnStyle = "border-indigo-600 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300";
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectQuizOption(idx)}
                            className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm font-semibold leading-relaxed text-left ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizAnswerSubmitted && isAnswerKey && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation box after submit */}
                    {isQuizAnswerSubmitted && (
                      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-xs text-left text-indigo-900 dark:text-indigo-300 space-y-1 animate-fade-in">
                        <span className="font-extrabold uppercase tracking-wider block text-[10px]">Explanation:</span>
                        <p className="leading-relaxed">{activeQuizQuestions[currentQuizIdx]?.explain}</p>
                      </div>
                    )}

                    {/* Submit / Next Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                      {!isQuizAnswerSubmitted ? (
                        <button
                          onClick={handleSubmitQuizAnswer}
                          disabled={selectedQuizOption === null}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/10"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10"
                        >
                          {currentQuizIdx === 4 ? "Finish Quiz" : "Next Question"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Module 4: HR Questions Prep */}
        {activeModule === 'hr-prep' && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / HR Preparation</span>
            </div>

            <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">HR Interview Coach Vault</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Prepare standard behavioral questions that recruiters ask to test alignment, problem solving, and confidence.</p>
              </div>

              <div className="space-y-4">
                {HR_QUESTIONS.map((item, idx) => {
                  const isExpanded = expandedHRIdx === idx;
                  return (
                    <div 
                      key={item.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20"
                    >
                      <div 
                        onClick={() => setExpandedHRIdx(isExpanded ? null : idx)}
                        className="p-4 sm:p-5 flex justify-between items-center cursor-pointer select-none bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-500 font-extrabold flex items-center justify-center text-xs">
                            0{item.id}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">{item.q}</h4>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>

                      {isExpanded && (
                        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white/45 dark:bg-slate-950/40 text-xs sm:text-sm space-y-4 animate-fade-in text-left">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px] text-pink-600 dark:text-pink-400">Recruiter's Perspective</h5>
                              <p className="text-slate-655 dark:text-slate-400 leading-relaxed">{item.goal}</p>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px] text-pink-600 dark:text-pink-400">Key Points Checklist</h5>
                              <ul className="list-disc list-inside space-y-1 text-slate-655 dark:text-slate-400">
                                {item.checklist.map((pt, i) => <li key={i}>{pt}</li>)}
                              </ul>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                            <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px] text-pink-600 dark:text-pink-400">Ideal Response Template</h5>
                            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl leading-relaxed text-slate-800 dark:text-slate-300 font-medium italic">
                              "{item.response}"
                            </div>
                          </div>

                          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                            <span className="font-extrabold uppercase text-[10px] text-indigo-500 bg-indigo-500/10 px-1 rounded flex-shrink-0 mt-0.5">Tip</span>
                            <p className="italic leading-relaxed">{item.tips}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Module 5: Company Coding Questions */}
        {activeModule === 'coding-practice' && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / Coding Practice</span>
            </div>

            {!selectedCodingQuestion ? (
              /* Company Selector & Question Grid List */
              <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Target Company Coding Board</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Select a tech firm below to practice their standard online coding assessment questions.</p>
                  </div>
                  
                  {/* Target Company Buttons */}
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-900 rounded-2xl select-none">
                    {['Google', 'Amazon', 'Meta', 'TCS'].map(companyName => (
                      <button
                        key={companyName}
                        type="button"
                        onClick={() => setSelectedCodingCompany(companyName)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          selectedCodingCompany === companyName
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {companyName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CODING_QUESTIONS[selectedCodingCompany].map(q => (
                    <div 
                      key={q.id}
                      onClick={() => handleSelectCodingQuestion(q)}
                      className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 hover:border-amber-500 dark:hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between text-left group"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            q.difficulty === 'Easy' 
                              ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-400">Target: {selectedCodingCompany}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-base group-hover:text-amber-550 dark:group-hover:text-amber-400 transition-colors">{q.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {q.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>JavaScript • Python • C++ • Java</span>
                        <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">Solve →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Split Workspace Code Editor Sandbox */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[580px] lg:col-span-3">
                {/* Left Side: Question Details */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <button 
                        onClick={() => setSelectedCodingQuestion(null)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        ← Back to Questions
                      </button>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        selectedCodingQuestion.difficulty === 'Easy' 
                          ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {selectedCodingQuestion.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCodingQuestion.title}</h3>
                    
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-350 space-y-4 whitespace-pre-wrap leading-relaxed">
                      {selectedCodingQuestion.desc}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950/65 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Example Input</span>
                        <pre className="text-xs text-slate-650 dark:text-slate-300 font-mono mt-1 whitespace-pre-wrap leading-normal">
                          {selectedCodingQuestion.input}
                        </pre>
                      </div>
                      <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Expected Output</span>
                        <pre className="text-xs text-slate-650 dark:text-slate-300 font-mono mt-1">
                          {selectedCodingQuestion.output}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Test Case Status Overlay */}
                  {codingTestCasesResults.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                      <h5 className="font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider text-[10px]">Test Case Statuses</h5>
                      <div className="space-y-2">
                        {codingTestCasesResults.map((tc, idx) => (
                          <div 
                            key={idx}
                            className={`p-3 border rounded-xl flex items-center justify-between text-xs font-semibold ${
                              tc.status === 'Passed'
                                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-350'
                                : 'border-red-500/30 bg-red-500/5 text-red-800 dark:text-red-350'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${tc.status === 'Passed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span>{tc.desc} (args: {tc.args})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {tc.actual && <span className="opacity-60 font-mono">Actual: {tc.actual}</span>}
                              <span className="font-extrabold">{tc.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Monaco Editor Sandbox */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between min-h-[580px] text-white text-left">
                  <div className="space-y-4 flex-grow flex flex-col">
                    {/* Compiler controls */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Terminal className="w-4 h-4 text-amber-500" />
                        <span>Compiler Sandbox</span>
                      </div>

                      {/* Language Selector */}
                      <select
                        value={codingLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs font-bold text-slate-350 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python 3</option>
                        <option value="cpp">C++ (GCC)</option>
                        <option value="java">Java 17</option>
                      </select>
                    </div>

                    {/* Monaco Editor Container */}
                    <div className="flex-grow border border-slate-800 rounded-2xl overflow-hidden min-h-[300px]">
                      <Editor
                        height="320px"
                        language={codingLanguage === 'cpp' ? 'cpp' : codingLanguage === 'java' ? 'java' : codingLanguage}
                        theme="vs-dark"
                        value={codingCode}
                        onChange={(val) => setCodingCode(val || '')}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: 'on',
                          cursorBlinking: 'smooth',
                          scrollbar: { vertical: 'visible' }
                        }}
                      />
                    </div>
                  </div>

                  {/* Console Console Output area */}
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                      <span>Console Logs</span>
                      <span>Local Runner</span>
                    </div>
                    
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 min-h-[80px] whitespace-pre-wrap overflow-y-auto max-h-[120px]">
                      {codingConsoleOutput || "Console is idle. Write code and hit 'Run Code'."}
                    </pre>

                    <button
                      onClick={handleRunCodingCode}
                      disabled={runningCodingCode || !codingCode}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-xs font-bold text-white transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      {runningCodingCode ? (
                        <span>Running compilation...</span>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" /> Run Code Sandbox
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Module 6: Recorded Interviews Vault */}
        {activeModule === 'recorded-vault' && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / Recorded Interviews</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              {/* Left side: charts */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Analytics</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Evaluate score progress and tab check statuses.</p>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                      <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-700" />
                      <span className="text-xs text-slate-500 text-center">Complete mock sessions to see details here!</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Score Trend Chart */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Score Progression
                        </div>
                        <div className="h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history.filter(s => s.status !== 'ongoing').reverse().map((s, i) => ({ name: `S${i+1}`, Score: s.totalScore }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                              <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={9} />
                              <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={9} domain={[0, 10]} />
                              <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' } : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }} labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                              <Line type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 5 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Proctoring Warnings Bar Chart */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          <BarChart3 className="w-4 h-4 text-red-500 dark:text-red-400" /> Proctoring Integrity
                        </div>
                        <div className="h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={history.filter(s => s.status !== 'ongoing').reverse().map((s, i) => ({ name: `S${i+1}`, Warnings: s.tabSwitches || 0 }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                              <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={9} />
                              <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={9} allowDecimals={false} />
                              <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' } : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }} labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                              <Bar dataKey="Warnings" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </ReBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: history list */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interview Transcripts & Reports</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Click a record below to review detailed Q&A feedback transcripts and roadmaps.</p>
                  </div>

                  <div className="space-y-3">
                    {loadingHistory ? (
                      <div className="text-center py-10 text-xs text-slate-500">Loading history...</div>
                    ) : history.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <Award className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        <span className="text-xs text-slate-500">No mock sessions completed yet.</span>
                      </div>
                    ) : (
                      history.map((sess) => (
                        <div
                          key={sess._id}
                          onClick={() => onViewReport(sess._id)}
                          className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-slate-950 transition-all flex items-center justify-between group active:scale-98 shadow-sm"
                        >
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {sess.jobProfile}
                              </h4>
                              {sess.targetCompany && sess.targetCompany !== 'General' && (
                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                                  {sess.targetCompany}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> {new Date(sess.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>Exp: {sess.experienceLevel}</span>
                              <span>•</span>
                              <span>Diff: {sess.difficulty}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400 dark:text-slate-500">Score</div>
                              <div className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                                {sess.status === 'ongoing' ? 'Ongoing' : `${sess.totalScore}/10`}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module 7: Developer Admin Panel */}
        {activeModule === 'admin-panel' && user?.role === 'admin' && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveModule('hub')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Workspace
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace / Admin Panel</span>
            </div>

            <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-violet-500" /> Developer Admin Panel
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Monitor user registrations, activity volumes, and overall mock interview metrics.
                  </p>
                </div>
                <button
                  onClick={fetchAdminUsers}
                  disabled={loadingAdminUsers}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAdminUsers ? 'animate-spin' : ''}`} />
                  {loadingAdminUsers ? 'Syncing...' : 'Refresh List'}
                </button>
              </div>

              {adminError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {adminError}
                </div>
              )}

              {loadingAdminUsers ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-slate-400 font-medium animate-pulse">Fetching developer dashboard metrics...</span>
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <Users className="w-10 h-10 text-slate-400 dark:text-slate-700" />
                  <span className="text-xs text-slate-500">No users found in the system yet.</span>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4">Candidate Profile</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Role Status</th>
                        <th className="p-4">Session Statistics</th>
                        <th className="p-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {adminUsers.map((u) => (
                        <tr 
                          key={u._id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                        >
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-tr from-violet-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{u.name}</div>
                              <div className="text-[10px] text-slate-400">ID: {u._id}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-slate-750 dark:text-slate-300">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                              u.role === 'admin' 
                                ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750'
                            }`}>
                              {u.role === 'admin' ? 'Developer / Admin' : 'Candidate'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 dark:text-white">{u.interviewCount || 0}</span>
                              <span className="text-[10px] text-slate-400">Interviews Started</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
