package com.example.collegeapp.repository

import com.example.collegeapp.data.local.Post
import com.example.collegeapp.data.local.PostDao
import kotlinx.coroutines.flow.Flow

class PostRepository(private val dao: PostDao) {
    val posts: Flow<List<Post>> = dao.getAll()
    suspend fun add(author: String, content: String) {
        dao.insert(Post(author = author, content = content, timestamp = System.currentTimeMillis()))
    }
    suspend fun delete(post: Post) = dao.delete(post)
}
