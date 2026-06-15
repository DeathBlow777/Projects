package com.example.collegeapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.collegeapp.data.local.Post
import com.example.collegeapp.repository.PostRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class PostsViewModel(private val repo: PostRepository) : ViewModel() {
    val posts = repo.posts.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    fun addPost(author: String, content: String) = viewModelScope.launch { repo.add(author, content) }
    fun deletePost(post: Post) = viewModelScope.launch { repo.delete(post) }
}
