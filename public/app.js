

const app = Vue.createApp({
  data() {
    return {
      currentTab: 'articles',
      showEditor: false,
      selectedPost: {
        id: null,
        title: '',
        content: ''
      },
      isEditing: false,
      newPost: {
        title: '',
        content: ''
      },
      posts: [
        { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
        { id: 2, title: 'Second Post', content: 'This is the content of the second post.' },
        { id: 3, title: 'Third Post', content: 'This is the content of the third post.' }
      ]
    };
  },
  methods: {
    openEditor() {
      this.showEditor = true;
    },
    editPost(post) {
      this.selectedPost = {
        id: post.id,
        title: post.title,
        content: post.content
      };
      this.isEditing = true;
    },
    savePost() {
      if (this.isEditing) {
        // 编辑模式下保存修改
        const index = this.posts.findIndex(post => post.id === this.selectedPost.id);
        if (index !== -1) {
          Vue.set(this.posts, index, {
            id: this.selectedPost.id,
            title: this.selectedPost.title,
            content: this.selectedPost.content
          });
        }
      } else {
        // 新增模式下保存博客
        this.posts.push({
          id: this.posts.length + 1,
          title: this.newPost.title,
          content: this.newPost.content
        });
      }

      // 清空编辑框
      this.newPost.title = '';
      this.newPost.content = '';
      // 关闭编辑框
      this.isEditing = false;
    },

    exportData() {
      // 获取所有文件的数据
      const allData = this.posts; // 假设博客文章数据存储在 this.posts 中

      // 将数据转换为 JSON 字符串
      const jsonData = JSON.stringify(allData);

      // 创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonData);
      downloadLink.download = 'data.json';

      // 模拟点击下载链接
      downloadLink.click();
    },

    openImportDialog() {
      // 触发文件选择对话框
      document.getElementById('importInput').click();
    },
    importData(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const jsonData = e.target.result;
        const importedData = JSON.parse(jsonData);

        // 在这里处理导入的数据，例如将其添加到博客文章数据中
        // 假设博客文章数据存储在 this.posts 中
        this.posts = this.posts.concat(importedData);
      };
      reader.readAsText(file);
    }
  }
});

app.mount('#app');
