package com.example.collegeapp.data

data class Department(val name: String, val description: String, val hod: String = "")
data class Faculty(val name: String, val department: String, val email: String)
data class Event(val title: String, val date: String, val location: String, val description: String = "")
data class Notice(val title: String, val date: String)

object SampleData {
    const val collegeName = "ABC Institute of Technology"
    val aboutText = """
        ABC Institute of Technology is committed to excellence in teaching, research, and innovation.
        Established in 2002, the institute offers undergraduate and postgraduate programs across multiple disciplines.
        Campus facilities include modern labs, a central library, and student activity centers.
    """.trimIndent()

    val departments = listOf(
        Department("Computer Science & Engineering", "AI, ML, Systems, Software Engineering", "Dr. S. Sharma"),
        Department("Electronics & Communication", "VLSI, Embedded Systems, Communications", "Dr. R. Mehta"),
        Department("Mechanical Engineering", "Thermal, Design, Robotics", "Dr. P. Rao")
    )

    val faculty = listOf(
        Faculty("Dr. Neha Gupta", "Computer Science & Engineering", "neha.gupta@abcit.edu"),
        Faculty("Prof. Arjun Iyer", "Electronics & Communication", "arjun.iyer@abcit.edu"),
        Faculty("Dr. Meera Nair", "Mechanical Engineering", "meera.nair@abcit.edu")
    )

    val events = listOf(
        Event("Tech Fest 2025", "12 Oct 2025", "Main Auditorium", "Coding contests, project expo, talks"),
        Event("Alumni Meetup", "22 Nov 2025", "Conference Hall", "Networking with alumni"),
        Event("Sports Day", "10 Dec 2025", "Sports Ground", "Track and team events")
    )

    val notices = listOf(
        Notice("Mid-Sem Exam Schedule Released", "05 Sep 2025"),
        Notice("Library Extended Hours", "15 Sep 2025"),
        Notice("Placement Registration Open", "01 Oct 2025")
    )
}
