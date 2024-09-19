import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the types for Post and User
interface Post {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
}

const AdminDashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Fetch posts and users when the component is mounted
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('/admin/posts');
                const usersResponse = await axios.get('/admin/users');
                setPosts(postsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    // Function to delete a post
    const deletePost = async (id: number) => {
        await axios.delete(`/admin/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
    };

    // Function to delete a user
    const deleteUser = async (id: number) => {
        await axios.delete(`/admin/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            
            <h2>Posts</h2>
            {posts.map(post => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <button onClick={() => deletePost(post.id)}>Delete Post</button>
                </div>
            ))}

            <h2>Users</h2>
            {users.map(user => (
                <div key={user.id}>
                    <h3>{user.name}</h3>
                    <button onClick={() => deleteUser(user.id)}>Delete User</button>
                </div>
            ))}
        </div>
    );
};

// Exporting to ensure this file is treated as a module
export default AdminDashboard;
