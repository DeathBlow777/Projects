package com.example.collegeapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.example.collegeapp.data.SampleData
import com.example.collegeapp.data.local.AppDatabase
import com.example.collegeapp.repository.PostRepository
import com.example.collegeapp.ui.theme.AppTheme
import com.example.collegeapp.viewmodel.PostsViewModel
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : ComponentActivity() {

    private val postsViewModel: PostsViewModel by viewModels(
        factoryProducer = {
            val db = Room.databaseBuilder(
                applicationContext,
                AppDatabase::class.java,
                "college-db"
            ).fallbackToDestructiveMigration().build()
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return PostsViewModel(PostRepository(db.postDao())) as T
                }
            }
        }
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                val navController = rememberNavController()
                AppScaffold(navController, postsViewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppScaffold(navController: NavHostController, postsVM: PostsViewModel) {
    var title by remember { mutableStateOf("College Info") }
    val canNavigateBack = navController.previousBackStackEntry != null

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title) },
                navigationIcon = {
                    if (canNavigateBack) {
                        IconButton(onClick = { navController.navigateUp() }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                    }
                }
            )
        }
    ) { inner ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(inner)
        ) {
            composable("home") {
                title = "College Info"
                HomeScreen(
                    onNavigate = { route, screenTitle ->
                        title = screenTitle
                        navController.navigate(route)
                    }
                )
            }
            composable("about") {
                title = "About"
                InfoScreen(
                    header = SampleData.collegeName,
                    body = SampleData.aboutText
                )
            }
            composable("departments") {
                title = "Departments"
                SimpleListScreen(
                    items = SampleData.departments.map { it.name to it.description }
                )
            }
            composable("faculty") {
                title = "Faculty"
                SimpleListScreen(
                    items = SampleData.faculty.map { it.name to "${it.department} — ${it.email}" }
                )
            }
            composable("events") {
                title = "Events"
                SimpleListScreen(
                    items = SampleData.events.map { it.title to "${it.date} • ${it.location}" }
                )
            }
            composable("notices") {
                title = "Notices"
                SimpleListScreen(
                    items = SampleData.notices.map { it.title to it.date }
                )
            }
            composable("forum") {
                title = "Student Forum"
                ForumScreen(postsVM)
            }
        }
    }
}

@Composable
fun HomeScreen(onNavigate: (String, String) -> Unit) {
    val sections = listOf(
        "About" to "about",
        "Departments" to "departments",
        "Faculty" to "faculty",
        "Events" to "events",
        "Notices" to "notices",
        "Forum" to "forum"
    )
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(sections) { (title, route) ->
            ElevatedCard(
                modifier = Modifier.fillMaxWidth().clickable {
                    onNavigate(route, title)
                }
            ) {
                Column(Modifier.padding(16.dp)) {
                    Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
                    Text(
                        when (route) {
                            "about" -> "Overview of the college"
                            "departments" -> "List of departments"
                            "faculty" -> "Faculty directory"
                            "events" -> "Upcoming events"
                            "notices" -> "Announcements & notices"
                            else -> "Discuss & ask questions"
                        },
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }
    }
}

@Composable
fun InfoScreen(header: String, body: String) {
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(header, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text(body, style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
fun SimpleListScreen(items: List<Pair<String, String>>) {
    if (items.isEmpty()) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No data")
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items) { (title, subtitle) ->
                ElevatedCard(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        if (subtitle.isNotBlank()) {
                            Spacer(Modifier.height(4.dp))
                            Text(subtitle, style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ForumScreen(vm: PostsViewModel) {
    val posts by vm.posts.collectAsState()
    var author by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }
    val fmt = remember { SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()) }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Add a Post", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = author,
            onValueChange = { author = it },
            label = { Text("Your name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = content,
            onValueChange = { content = it },
            label = { Text("Message") },
            minLines = 3,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = {
                if (content.isNotBlank()) {
                    vm.addPost(author.ifBlank { "Anonymous" }, content.trim())
                    content = ""
                }
            }
        ) { Text("Post") }

        Spacer(Modifier.height(16.dp))
        Text("Recent Posts", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))
        if (posts.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No posts yet. Be the first to post!")
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.weight(1f)) {
                items(posts) { post ->
                    ElevatedCard(Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(12.dp)) {
                            Text(post.author, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(4.dp))
                            Text(post.content, maxLines = 6, overflow = TextOverflow.Ellipsis)
                            Spacer(Modifier.height(6.dp))
                            Text(fmt.format(Date(post.timestamp)), style = MaterialTheme.typography.bodySmall)
                            Spacer(Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.End, modifier = Modifier.fillMaxWidth()) {
                                TextButton(onClick = { vm.deletePost(post) }) { Text("Delete") }
                            }
                        }
                    }
                }
            }
        }
    }
}
