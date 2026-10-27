
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// ==========================================
// TOPIC TO CSV FILE MAPPINGS
// ==========================================

const topicFiles = {
    // ==========================================
    // DATA STRUCTURES
    // ==========================================

    "Arrays": {
        folder: "dsa",
        file: "arrays.csv",
        csvTopics: ["Arrays"]
    },
    "Linked List": {
        folder: "dsa",
        file: "linked_list.csv",
        csvTopics: ["Linked List", "Linked Lists"]
    },
    "Stack": {
        folder: "dsa",
        file: "stack.csv",
        csvTopics: ["Stack", "Stacks"]
    },
    "Queue": {
        folder: "dsa",
        file: "queue.csv",
        csvTopics: ["Queue", "Queues"]
    },
    "Trees": {
        folder: "dsa",
        file: "trees.csv",
        csvTopics: ["Trees", "Tree"]
    },
    "Graphs": {
        folder: "dsa",
        file: "graphs.csv",
        csvTopics: ["Graphs", "Graph"]
    },
    "Hashing": {
        folder: "dsa",
        file: "hashing.csv",
        csvTopics: ["Hashing"]
    },
    "Heap": {
        folder: "dsa",
        file: "heap.csv",
        csvTopics: ["Heap", "Heaps"]
    },

    // ==========================================
    // OPERATING SYSTEMS
    // ==========================================

    "Process Management": {
        folder: "operating_system",
        file: "Process_Management.csv",
        csvTopics: ["Processes", "Process", "Process Management"]
    },
    "Threads": {
        folder: "operating_system",
        file: "threads.csv",
        csvTopics: ["Threads", "Thread"]
    },
    "CPU Scheduling": {
        folder: "operating_system",
        file: "cpu_scheduling.csv",
        csvTopics: ["CPU Scheduling", "CPU Scheduling Algorithms"]
    },
    "Deadlocks": {
        folder: "operating_system",
        file: "deadlocks.csv",
        csvTopics: ["Deadlocks", "Deadlock"]
    },
    "Main Memory Management": {
        folder: "operating_system",
        file: "main_memory_management.csv",
        csvTopics: ["Memory Management", "Main Memory Management"]
    },
    "Process Synchronization": {
        folder: "operating_system",
        file: "process_synchronization.csv",
        csvTopics: ["Process Synchronization"]
    },
    "Virtual Memory": {
        folder: "operating_system",
        file: "virtual_memory.csv",
        csvTopics: ["Virtual Memory"]
    },
    "File System Management": {
        folder: "operating_system",
        file: "file_system_management.csv",
        csvTopics: ["File System Management", "File Systems"]
    },
    "OS Fundamentals": {
        folder: "operating_system",
        file: "os_fundamentals.csv",
        csvTopics: [
            "OS Fundamentals",
            "Operating System Fundamentals",
            "Operating System Basics"
        ]
    },

    // ==========================================
    // OOP WITH JAVA
    // ==========================================

    "Introduction to OOP and Java Basics": {
        folder: "oop_with_java",
        file: "oop_java_basics.csv",
        csvTopics: [
            "Introduction to OOP and Java Basics",
            "OOP and Java Basics"
        ]
    },
    "Classes, Objects, Fields and Methods": {
        folder: "oop_with_java",
        file: "classes_objects_methods.csv",
        csvTopics: [
            "Classes, Objects, Fields and Methods",
            "Classes and Objects"
        ]
    },
    "Constructors and Constructor Overloading": {
        folder: "oop_with_java",
        file: "constructors.csv",
        csvTopics: [
            "Constructors and Constructor Overloading",
            "Constructors"
        ]
    },
    "Encapsulation and Access Modifiers": {
        folder: "oop_with_java",
        file: "encapsulation_access_modifiers.csv",
        csvTopics: [
            "Encapsulation and Access Modifiers",
            "Encapsulation"
        ]
    },
    "Inheritance and Types of Inheritance": {
        folder: "oop_with_java",
        file: "inheritance.csv",
        csvTopics: [
            "Inheritance and Types of Inheritance",
            "Inheritance"
        ]
    },
    "Polymorphism, Method Overloading and Overriding": {
        folder: "oop_with_java",
        file: "polymorphism.csv",
        csvTopics: [
            "Polymorphism, Method Overloading and Overriding",
            "Polymorphism"
        ]
    },
    "Abstraction and Abstract Classes": {
        folder: "oop_with_java",
        file: "abstraction.csv",
        csvTopics: [
            "Abstraction and Abstract Classes",
            "Abstraction"
        ]
    },
    "Interfaces and Multiple Inheritance through Interfaces": {
        folder: "oop_with_java",
        file: "interfaces.csv",
        csvTopics: [
            "Interfaces and Multiple Inheritance through Interfaces",
            "Interfaces"
        ]
    },
    "Packages, this, super and static Keywords": {
        folder: "oop_with_java",
        file: "packages_this_super_static.csv",
        csvTopics: [
            "Packages, this, super and static Keywords",
            "Packages and Keywords"
        ]
    },
    "Exception Handling and Object-Oriented Design Principles": {
        folder: "oop_with_java",
        file: "exception_handling_design.csv",
        csvTopics: [
            "Exception Handling and Object-Oriented Design Principles",
            "Exception Handling"
        ]
    },

    // ==========================================
    // DATABASE MANAGEMENT SYSTEMS
    // ==========================================

    "DBMS Fundamentals": {
        folder: "DBMS",
        file: "DBMS_01_DBMS_Fundamentals.csv",
        csvTopics: ["DBMS Fundamentals"]
    },
    "ER Model": {
        folder: "DBMS",
        file: "DBMS_02_ER_Model.csv",
        csvTopics: ["ER Model"]
    },
    "Relational Model and Relational Algebra": {
        folder: "DBMS",
        file: "DBMS_03_Relational_Model_Algebra.csv",
        csvTopics: ["Relational Model and Relational Algebra"]
    },
    "SQL Queries and Constraints": {
        folder: "DBMS",
        file: "DBMS_04_SQL_Queries.csv",
        csvTopics: ["SQL Queries and Constraints"]
    },
    "Functional Dependencies and Normalization": {
        folder: "DBMS",
        file: "DBMS_05_Functional_Dependencies_Normalization.csv",
        csvTopics: ["Functional Dependencies and Normalization"]
    },
    "Transaction Management and ACID Properties": {
        folder: "DBMS",
        file: "DBMS_06_Transactions_ACID.csv",
        csvTopics: ["Transaction Management and ACID Properties"]
    },
    "Concurrency Control and Serializability": {
        folder: "DBMS",
        file: "DBMS_07_Concurrency_Control.csv",
        csvTopics: ["Concurrency Control and Serializability"]
    },
    "Database Recovery and Logging": {
        folder: "DBMS",
        file: "DBMS_08_Recovery_Logging.csv",
        csvTopics: ["Database Recovery and Logging"]
    },
    "File Organization and Indexing": {
        folder: "DBMS",
        file: "DBMS_09_File_Organization_Indexing.csv",
        csvTopics: ["File Organization and Indexing"]
    },
    "Query Processing and Optimization": {
        folder: "DBMS",
        file: "DBMS_10_Query_Processing_Optimization.csv",
        csvTopics: ["Query Processing and Optimization"]
    },

    // ==========================================
    // SEMESTER 4: ADA
    // ==========================================

    "Introduction to Algorithms and Problem Solving": {
        folder: "ada",
        file: "ADA_01_Introduction_to_Algorithms_and_Problem_Solving.csv",
        csvTopics: ["Introduction to Algorithms and Problem Solving"]
    },
    "Algorithm Efficiency and Asymptotic Analysis": {
        folder: "ada",
        file: "ADA_02_Algorithm_Efficiency_and_Asymptotic_Analysis.csv",
        csvTopics: ["Algorithm Efficiency and Asymptotic Analysis"]
    },
    "Mathematical Analysis of Algorithms": {
        folder: "ada",
        file: "ADA_03_Mathematical_Analysis_of_Algorithms.csv",
        csvTopics: ["Mathematical Analysis of Algorithms"]
    },
    "Brute Force Algorithms": {
        folder: "ada",
        file: "ADA_04_Brute_Force_Algorithms.csv",
        csvTopics: ["Brute Force Algorithms"]
    },
    "Exhaustive Search and Decrease and Conquer": {
        folder: "ada",
        file: "ADA_05_Exhaustive_Search_and_Decrease_and_Conquer.csv",
        csvTopics: ["Exhaustive Search and Decrease and Conquer"]
    },
    "Divide and Conquer Algorithms": {
        folder: "ada",
        file: "ADA_06_Divide_and_Conquer_Algorithms.csv",
        csvTopics: ["Divide and Conquer Algorithms"]
    },
    "Transform and Conquer Algorithms": {
        folder: "ada",
        file: "ADA_07_Transform_and_Conquer_Algorithms.csv",
        csvTopics: ["Transform and Conquer Algorithms"]
    },
    "Space-Time Trade-offs and String Matching": {
        folder: "ada",
        file: "ADA_08_Space_Time_Trade_offs_and_String_Matching.csv",
        csvTopics: [
            "Space-Time Trade-offs and String Matching",
            "Space Time Trade-offs and String Matching"
        ]
    },
    "Dynamic Programming and Greedy Algorithms": {
        folder: "ada",
        file: "ADA_09_Dynamic_Programming_and_Greedy_Algorithms.csv",
        csvTopics: ["Dynamic Programming and Greedy Algorithms"]
    },
    "Algorithmic Complexity and Advanced Strategies": {
        folder: "ada",
        file: "ADA_10_Algorithmic_Complexity_and_Advanced_Strategies.csv",
        csvTopics: ["Algorithmic Complexity and Advanced Strategies"]
    },

    // ==========================================
    // SEMESTER 4: MICROCONTROLLERS
    // ==========================================

    "ARM Embedded Systems and RISC Design Philosophy": {
        folder: "microcontrollers",
        file: "BCS402_01_ARM_Embedded_Systems_and_RISC_Design_Philosophy.csv",
        csvTopics: ["ARM Embedded Systems and RISC Design Philosophy"]
    },
    "ARM Processor Fundamentals, Registers and CPSR": {
        folder: "microcontrollers",
        file: "BCS402_02_ARM_Processor_Fundamentals_Registers_and_CPSR.csv",
        csvTopics: ["ARM Processor Fundamentals, Registers and CPSR"]
    },
    "ARM Instruction Set and Addressing Modes": {
        folder: "microcontrollers",
        file: "BCS402_03_ARM_Instruction_Set_and_Addressing_Modes.csv",
        csvTopics: ["ARM Instruction Set and Addressing Modes"]
    },
    "C Compilers, C Data Types and Optimization": {
        folder: "microcontrollers",
        file: "BCS402_04_C_Compilers_C_Data_Types_and_Optimization.csv",
        csvTopics: ["C Compilers, C Data Types and Optimization"]
    },
    "ARM Exceptions, Interrupts and IRQ/FIQ": {
        folder: "microcontrollers",
        file: "BCS402_05_ARM_Exceptions_Interrupts_and_IRQ_FIQ.csv",
        csvTopics: [
            "ARM Exceptions, Interrupts and IRQ/FIQ",
            "ARM Exceptions, Interrupts and IRQ FIQ"
        ]
    },
    "Firmware, Bootloaders and RedBoot": {
        folder: "microcontrollers",
        file: "BCS402_06_Firmware_Bootloaders_and_RedBoot.csv",
        csvTopics: ["Firmware, Bootloaders and RedBoot"]
    },
    "Cache Memory Architecture and Performance": {
        folder: "microcontrollers",
        file: "BCS402_07_Cache_Memory_Architecture_and_Performance.csv",
        csvTopics: ["Cache Memory Architecture and Performance"]
    },
    "Memory Hierarchy, Write Buffers and Cache Policies": {
        folder: "microcontrollers",
        file: "BCS402_08_Memory_Hierarchy_Write_Buffers_and_Cache_Policies.csv",
        csvTopics: ["Memory Hierarchy, Write Buffers and Cache Policies"]
    },

    // ==========================================
    // SEMESTER 4: BIOLOGY FOR COMPUTER ENGINEERS
    // ==========================================

    "Cell Structure, Functions and Stem Cells": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_01_Cell_Structure_Functions_and_Stem_Cells.csv",
        csvTopics: ["Cell Structure, Functions and Stem Cells"]
    },
    "Biomolecules: Carbohydrates, Nucleic Acids, Proteins and Lipids": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_02_Biomolecules_Carbohydrates_Nucleic_Acids_Proteins_and_Lipids.csv",
        csvTopics: [
            "Biomolecules: Carbohydrates, Nucleic Acids, Proteins and Lipids"
        ]
    },
    "Enzymes, Vitamins and Hormones": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_03_Enzymes_Vitamins_and_Hormones.csv",
        csvTopics: ["Enzymes, Vitamins and Hormones"]
    },
    "Biomolecule Applications: Filters, Bioplastics, Vaccines and Industry": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_04_Biomolecule_Applications_Filters_Bioplastics_Vaccines_and_Industry.csv",
        csvTopics: [
            "Biomolecule Applications: Filters, Bioplastics, Vaccines and Industry"
        ]
    },
    "Anatomical Principles for Bioengineering Design": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_05_Anatomical_Principles_for_Bioengineering_Design.csv",
        csvTopics: ["Anatomical Principles for Bioengineering Design"]
    },
    "Biomimetics: Nature-Inspired Materials and Mechanisms": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_06_Biomimetics_Nature_Inspired_Materials_and_Mechanisms.csv",
        csvTopics: ["Biomimetics: Nature-Inspired Materials and Mechanisms"]
    },
    "Bioengineering Trends: Tissue Engineering, Bioprinting and Biocomputing": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_07_Bioengineering_Trends_Tissue_Engineering_Bioprinting_and_Biocomputing.csv",
        csvTopics: [
            "Bioengineering Trends: Tissue Engineering, Bioprinting and Biocomputing"
        ]
    },
    "Bioconcrete, Bioremediation and Biomining": {
        folder: "biology_for_computer_engineers",
        file: "BBOC407_08_Bioconcrete_Bioremediation_and_Biomining.csv",
        csvTopics: ["Bioconcrete, Bioremediation and Biomining"]
    },

    // ==========================================
    // SEMESTER 4: DDCO
    // ==========================================

    "Computer Organization and Basic Structure": {
        folder: "ddco",
        file: "DDCO_06_Computer_Organization_and_Basic_Structure.csv",
        csvTopics: ["Computer Organization and Basic Structure"]
    },
    "Instruction Sets and Addressing Modes": {
        folder: "ddco",
        file: "DDCO_07_Instruction_Sets_and_Addressing_Modes.csv",
        csvTopics: ["Instruction Sets and Addressing Modes"]
    },
    "CPU Datapath and Control Unit": {
        folder: "ddco",
        file: "DDCO_08_CPU_Datapath_and_Control_Unit.csv",
        csvTopics: ["CPU Datapath and Control Unit"]
    },
    "Boolean Algebra and Logic Gates": {
        folder: "ddco",
        file: "DDCO_MCQ_Questions_Boolean_Algebra_and_Logic_Gates.csv",
        csvTopics: ["Boolean Algebra and Logic Gates"]
    },
    "Combinational Logic Circuits": {
        folder: "ddco",
        file: "DDCO_MCQ_Questions_Combinational_Logic_Circuits.csv",
        csvTopics: ["Combinational Logic Circuits"]
    },
    "Sequential Logic Circuits": {
        folder: "ddco",
        file: "DDCO_MCQ_Questions_Sequential_Logic_Circuits.csv",
        csvTopics: ["Sequential Logic Circuits"]
    },
    "Digital Design and Logic Fundamentals": {
        folder: "ddco",
        file: "DDCO_MCQ_Questions.csv",
        csvTopics: [
            "Digital Design and Logic Fundamentals",
            "DDCO",
            "Digital Design and Computer Organization"
        ]
    }
};

// ==========================================
// NORMALIZATION HELPERS
// ==========================================

function normalize(value) {
    return String(value ?? "")
        .replace(/^\uFEFF/, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function normalizeSubject(value) {
    // Normalize "&" and "and" to the same value.
    const name = normalize(value)
        .replace(/\s*&\s*/g, " and ")
        .replace(/[–—-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const subjectAliases = {
        "operating system": "operating systems",
        "operating systems": "operating systems",

        "data structure": "data structures",
        "data structures": "data structures",

        "oop with java": "oop with java",
        "object oriented programming with java": "oop with java",

        "dbms": "database management systems",
        "database management system": "database management systems",
        "database management systems": "database management systems",

        "ada": "analysis and design of algorithms",
        "analysis and design of algorithms":
            "analysis and design of algorithms",

        "bcs402": "microcontrollers",
        "microcontroller": "microcontrollers",
        "microcontrollers": "microcontrollers",

        "bboc407": "biology for computer engineers",
        "biology for computer engineers":
            "biology for computer engineers",

        "ddco": "digital design and computer organization",
        "digital design and computer organization":
            "digital design and computer organization"
    };

    return subjectAliases[name] || name;
}

// ==========================================
// DETECT CSV DELIMITER
// ==========================================

function detectSeparator(filePath) {
    const content = fs.readFileSync(filePath, "utf8");

    const firstLine = content
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .find((line) => line.trim() !== "");

    if (!firstLine) {
        return ",";
    }

    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;

    if (tabCount > commaCount && tabCount > semicolonCount) {
        return "\t";
    }

    if (semicolonCount > commaCount) {
        return ";";
    }

    return ",";
}

// ==========================================
// GET QUIZ QUESTIONS
// ==========================================

router.get("/csvquestions", (req, res) => {
    const { subject, topic, difficulty } = req.query;

    if (!subject || !topic || !difficulty) {
        return res.status(400).json({
            message: "subject, topic, and difficulty are required"
        });
    }

    db.query(
        "SELECT name FROM subjects WHERE id = ?",
        [subject],
        (subjectError, subjectResult) => {
            if (subjectError) {
                console.error("Subject query error:", subjectError);

                return res.status(500).json({
                    message: "Unable to retrieve subject"
                });
            }

            if (!subjectResult.length) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            const subjectName = subjectResult[0].name;

            // Confirm that the topic belongs to the selected subject.
            db.query(
                "SELECT topic_name FROM topics WHERE id = ? AND subject_id = ?",
                [topic, subject],
                (topicError, topicResult) => {
                    if (topicError) {
                        console.error("Topic query error:", topicError);

                        return res.status(500).json({
                            message: "Unable to retrieve topic"
                        });
                    }

                    if (!topicResult.length) {
                        return res.status(404).json({
                            message: "Topic not found for this subject"
                        });
                    }

                    const topicName = topicResult[0].topic_name;
                    const mapping = topicFiles[topicName];

                    if (!mapping) {
                        console.error("No CSV mapping for:", topicName);

                        return res.status(404).json({
                            message:
                                `No CSV mapping configured for topic: ${topicName}`
                        });
                    }

                    const filePath = path.join(
                        __dirname,
                        "../../dataset",
                        mapping.folder,
                        mapping.file
                    );

                    console.log("\n========== CSV DEBUG ==========");
                    console.log("Subject from database:", subjectName);
                    console.log("Topic from database:", topicName);
                    console.log("Requested difficulty:", difficulty);
                    console.log("CSV filename:", mapping.file);
                    console.log("CSV full path:", filePath);

                    if (!fs.existsSync(filePath)) {
                        console.error("CSV file not found:", filePath);

                        return res.status(404).json({
                            message: `CSV file not found: ${mapping.file}`,
                            expectedPath: filePath
                        });
                    }

                    let separator;

                    try {
                        separator = detectSeparator(filePath);
                    } catch (error) {
                        console.error(
                            "CSV separator detection error:",
                            error
                        );

                        return res.status(500).json({
                            message: "Unable to inspect CSV file"
                        });
                    }

                    console.log(
                        "Detected CSV separator:",
                        separator === "\t"
                            ? "TAB"
                            : separator === ";"
                                ? "SEMICOLON"
                                : "COMMA"
                    );

                    const questions = [];

                    fs.createReadStream(filePath)
                        .pipe(
                            csv({
                                separator,
                                mapHeaders: ({ header }) =>
                                    header.replace(/^\uFEFF/, "").trim()
                            })
                        )
                        .on("data", (row) => {
                            if (
                                row.Subject &&
                                row.Topic &&
                                row.Difficulty &&
                                row.Question
                            ) {
                                questions.push(row);
                            }
                        })
                        .on("end", () => {
                            const acceptedTopics = [
                                topicName,
                                ...(mapping.csvTopics || [])
                            ].map(normalize);

                            const filteredQuestions = questions.filter(
                                (question) => {
                                    const subjectMatches =
                                        normalizeSubject(question.Subject) ===
                                        normalizeSubject(subjectName);

                                    const topicMatches =
                                        acceptedTopics.includes(
                                            normalize(question.Topic)
                                        );

                                    const difficultyMatches =
                                        normalize(question.Difficulty) ===
                                        normalize(difficulty);

                                    return (
                                        subjectMatches &&
                                        topicMatches &&
                                        difficultyMatches
                                    );
                                }
                            );

                            console.log(
                                "Total valid CSV rows:",
                                questions.length
                            );
                            console.log(
                                "First CSV subject:",
                                questions[0]?.Subject
                            );
                            console.log(
                                "First CSV topic:",
                                questions[0]?.Topic
                            );
                            console.log(
                                "Matching Questions:",
                                filteredQuestions.length
                            );
                            console.log("===============================\n");

                            // Shuffle questions before selecting five.
                            for (
                                let i = filteredQuestions.length - 1;
                                i > 0;
                                i--
                            ) {
                                const j = Math.floor(
                                    Math.random() * (i + 1)
                                );

                                [
                                    filteredQuestions[i],
                                    filteredQuestions[j]
                                ] = [
                                    filteredQuestions[j],
                                    filteredQuestions[i]
                                ];
                            }

                            return res.json(
                                filteredQuestions.slice(0, 5)
                            );
                        })
                        .on("error", (error) => {
                            console.error("CSV read error:", error);

                            if (!res.headersSent) {
                                return res.status(500).json({
                                    message: "Error reading CSV file"
                                });
                            }
                        });
                }
            );
        }
    );
});

module.exports = router;
