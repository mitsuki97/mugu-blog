<template>
  <div id="app">
    <div class="sidebar">
      <ul>
        <li @click="currentTab = 'articles'" :class="{ active: currentTab === 'articles' }">文章</li>
        <li @click="currentTab = 'menu'" :class="{ active: currentTab === 'menu' }">菜单</li>
        <li @click="currentTab = 'themes'" :class="{ active: currentTab === 'themes' }">主题</li>
        <li @click="currentTab = 'settings'" :class="{ active: currentTab === 'settings' }">设置</li>
      </ul>
    </div>
    <div class="content">

        <div v-if="currentTab === 'articles'">
          <h1>文章</h1>
          <button @click="openEditor">新增博客</button>
          <input type="file" id="importInput" @change="importData" accept=".json">
          <button @click="openImportDialog">导入</button>
          <button @click="exportData">导出</button>

          <div v-if="isEditing" class="custom-editor">
            <h2>编辑博客</h2>
            <input v-model="selectedPost.title" placeholder="标题">
            <textarea v-model="selectedPost.content" placeholder="内容"></textarea>
            <button @click="savePost">保存</button>
          </div>

          <div v-else>
            <div v-for="post in posts" :key="post.id">
              <h2 @click="editPost(post)">{{ post.title }}</h2>
              <p>{{ post.content }}</p>
              <hr>
            </div>
          </div>
        </div>
        <div v-if="currentTab === 'menu'">
          <h1>菜单</h1>
          <!-- 菜单内容 -->
        </div>
        <div v-if="currentTab === 'themes'">
          <h1>主题</h1>
          <!-- 主题设置 -->
        </div>
        <div v-if="currentTab === 'settings'">
          <h1>设置</h1>
          <!-- 其他设置 -->
        </div>

    </div>
    <div class="custom-editor" v-if="showEditor">
      <h2>新增博客</h2>
      <input v-model="newPost.title" placeholder="标题">
      <textarea v-model="newPost.content" placeholder="内容"></textarea>
      <button @click="savePost">保存</button>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';

const currentTab = ref('articles');
const showEditor = ref(false);
const selectedPost = ref({
  id: null,
  title: '',
  content: ''
});
const isEditing = ref(false);
const newPost = ref({
  title: '',
  content: ''
});
const posts = ref([
  { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the content of the second post.' },
  { id: 3, title: 'Third Post', content: 'This is the content of the third post.' }
]);

function openEditor() {
  showEditor.value = true;
}

function editPost(post) {
  selectedPost.value = {
    id: post.id,
    title: post.title,
    content: post.content
  };
  isEditing.value = true;
}

function savePost() {
  if (isEditing.value) {
    // 编辑模式下保存修改
    const index = posts.value.findIndex(post => post.id === selectedPost.value.id);
    if (index !== -1) {
      posts.value[index] = {
        id: selectedPost.value.id,
        title: selectedPost.value.title,
        content: selectedPost.value.content
      };
    }

  } else {
     // 新增模式下保存博客
    posts.value.push({
      id: posts.value.length + 1,
      title: newPost.value.title,
      content: newPost.value.content
    });
  }
  // 清空编辑框
  newPost.value.title = '';
  newPost.value.content = '';
  // 关闭编辑框
  isEditing.value = false;
}

function exportData() {
  const allData = posts.value;
  const jsonData = JSON.stringify(allData);
  const downloadLink = document.createElement('a');
  downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonData);
  downloadLink.download = 'data.json';
  downloadLink.click();
}

function openImportDialog() {
  document.getElementById('importInput').click();
}

function importData(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const jsonData = e.target.result;
    const importedData = JSON.parse(jsonData);
    posts.value = posts.value.concat(importedData);
  };
  reader.readAsText(file);
}

</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

/* 整体布局 */
#app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f1f1f1;
  padding: 20px;
}

.content {
  flex: 1;
  padding: 20px;
}

/* 侧边栏样式 */
.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
}

.sidebar li:hover {
  background-color: #ddd;
}

.sidebar li.active {
  background-color: #ccc;
}

/* 文章样式 */
.content h1 {
  margin-top: 0;
}

.content button {
  margin-bottom: 10px;
}

.content h2 {
  margin-top: 20px;
}

/* 编辑框样式 */
.custom-editor {
  /* display: none; */
  margin-top: 20px;
}

.custom-editor h2 {
  margin-top: 0;
}

.custom-editor input,
.custom-editor textarea {
  width: 100%;
  margin-bottom: 10px;
}

/* 特效 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
