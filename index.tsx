import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTYgMjFoLTggYTEgMSAwIDAgMSAtMSAtMSB2IC0xIGExIDEgMSAwIDAgMSAxIC0xIGggOCBhIDEgMSAwIDAgMSAxIDEgdiAxIGExIDEgMSAwIDAgMSAtMSAxIHoiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
const defaultCoverPhoto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWFhZWViIj48L3JlY3Q+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjY2NjIj5Db3ZlciBQaG90bzwvdGV4dD48L3N2Zz4=';


// --- i18n Translations ---
const translations: Record<string, Record<string, string>> = {
    vi: {
        login: 'Đăng nhập',
        signup: 'Đăng ký',
        username: 'Tên đăng nhập',
        password: 'Mật khẩu',
        loginTitle: 'Đăng nhập',
        signupTitle: 'Đăng ký',
        noAccount: 'Chưa có tài khoản?',
        hasAccount: 'Đã có tài khoản?',
        editProfile: 'Chỉnh sửa hồ sơ',
        changePicture: 'Thay đổi ảnh',
        changeCoverPhoto: 'Đổi ảnh bìa',
        bio: 'Tiểu sử',
        bioPlaceholder: 'Viết một chút về bạn...',
        saveChanges: 'Lưu thay đổi',
        logout: 'Đăng xuất',
        likes: 'Lượt thích',
        comments: 'Bình luận',
        like: 'Thích',
        comment: 'Bình luận',
        writeComment: 'Viết bình luận...',
        send: 'Gửi',
        generatedByAI: 'Được tạo bởi AI ✨',
        tagLocation: 'Gắn vị trí',
        post: 'Đăng',
        category_general: 'Thảo luận',
        category_marketplace: 'Chợ trời',
        category_event: 'Sự kiện',
        category_alert: 'Cảnh báo',
        placeholder_general: 'Bạn đang nghĩ gì',
        placeholder_marketplace: 'Mô tả món đồ bạn muốn bán...',
        placeholder_event: 'Mô tả sự kiện của bạn...',
        placeholder_alert: 'Bạn muốn cảnh báo điều gì?',
        all: 'Tất cả',
        close: 'Đóng',
        unknownError: 'Đã xảy ra lỗi không xác định.',
        usernameExists: 'Tên đăng nhập đã tồn tại.',
        invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không hợp lệ.',
        usernameInUse: 'Tên đăng nhập này đã được sử dụng.',
        usernameEmpty: 'Tên đăng nhập không được để trống.',
    },
    zh: {
        login: '登录',
        signup: '注册',
        username: '用户名',
        password: '密码',
        loginTitle: '登录',
        signupTitle: '注册',
        noAccount: '还没有账户？',
        hasAccount: '已有账户？',
        editProfile: '编辑个人资料',
        changePicture: '更改照片',
        changeCoverPhoto: '更换封面照片',
        bio: '个人简介',
        bioPlaceholder: '写一点关于你的介绍...',
        saveChanges: '保存更改',
        logout: '登出',
        likes: '赞',
        comments: '评论',
        like: '赞',
        comment: '评论',
        writeComment: '写评论...',
        send: '发送',
        generatedByAI: '由AI生成 ✨',
        tagLocation: '标记位置',
        post: '发布',
        category_general: '讨论',
        category_marketplace: '市场',
        category_event: '活动',
        category_alert: '警报',
        placeholder_general: '你在想什么',
        placeholder_marketplace: '描述你想出售的物品...',
        placeholder_event: '描述你的活动...',
        placeholder_alert: '你想警告什么？',
        all: '全部',
        close: '关闭',
        unknownError: '发生未知错误。',
        usernameExists: '用户名已存在。',
        invalidCredentials: '用户名或密码无效。',
        usernameInUse: '该用户名已被使用。',
        usernameEmpty: '用户名不能为空。',
    },
    es: {
        login: 'Iniciar sesión',
        signup: 'Registrarse',
        username: 'Nombre de usuario',
        password: 'Contraseña',
        loginTitle: 'Iniciar Sesión',
        signupTitle: 'Registrarse',
        noAccount: '¿No tienes una cuenta?',
        hasAccount: '¿Ya tienes una cuenta?',
        editProfile: 'Editar Perfil',
        changePicture: 'Cambiar foto',
        changeCoverPhoto: 'Cambiar foto de portada',
        bio: 'Biografía',
        bioPlaceholder: 'Escribe algo sobre ti...',
        saveChanges: 'Guardar Cambios',
        logout: 'Cerrar Sesión',
        likes: 'Me gusta',
        comments: 'Comentarios',
        like: 'Me gusta',
        comment: 'Comentar',
        writeComment: 'Escribe un comentario...',
        send: 'Enviar',
        generatedByAI: 'Generado por IA ✨',
        tagLocation: 'Etiquetar ubicación',
        post: 'Publicar',
        category_general: 'Discusión',
        category_marketplace: 'Mercado',
        category_event: 'Evento',
        category_alert: 'Alerta',
        placeholder_general: '¿Qué estás pensando',
        placeholder_marketplace: 'Describe el artículo que quieres vender...',
        placeholder_event: 'Describe tu evento...',
        placeholder_alert: '¿Sobre qué quieres alertar?',
        all: 'Todos',
        close: 'Cerrar',
        unknownError: 'Ocurrió un error desconocido.',
        usernameExists: 'El nombre de usuario ya existe.',
        invalidCredentials: 'Nombre de usuario o contraseña no válidos.',
        usernameInUse: 'Este nombre de usuario ya está en uso.',
        usernameEmpty: 'El nombre de usuario no puede estar vacío.',
    },
};

// --- Data Types ---
type User = {
  username: string;
  password?: string;
  avatar: string;
  bio?: string;
  coverPhoto?: string;
};

type Comment = {
  id: number;
  author: string;
  text: string;
};

type PostCategory = 'general' | 'marketplace' | 'event' | 'alert';

type Post = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  isAI: boolean;
  likes: number;
  comments: Comment[];
  category: PostCategory;
  location?: string;
};

// --- Component Props ---
interface PostComponentProps {
  post: Post;
  currentUser: User | null;
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
  t: (key: string) => string;
}

interface AuthModalProps {
    mode: 'login' | 'signup';
    onClose: () => void;
    onLogin: (username: string, pass: string) => Promise<void>;
    onSignUp: (username: string, pass: string) => Promise<void>;
    t: (key: string) => string;
}

interface ProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (username: string, bio: string, avatar: string, coverPhoto: string) => Promise<void>;
    onLogout: () => void;
    t: (key: string) => string;
}

const categoryDetails: Record<PostCategory, { color: string; }> = {
    general: { color: '#1877f2' },
    marketplace: { color: '#42b72a' },
    event: { color: '#f7b928' },
    alert: { color: '#fa383e' }
};

// --- Auth Modal Component ---
const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onLogin, onSignUp, t }) => {
    const [currentMode, setCurrentMode] = useState(mode);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (currentMode === 'login') {
                await onLogin(username, password);
            } else {
                await onSignUp(username, password);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? t(err.message) : t('unknownError');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label={t('close')}>&times;</button>
                <h2>{currentMode === 'login' ? t('loginTitle') : t('signupTitle')}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('username')}
                        required
                        aria-label={t('username')}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password')}
                        required
                        aria-label={t('password')}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : (currentMode === 'login' ? t('login') : t('signup'))}
                    </button>
                </form>
                <p className="switch-mode">
                    {currentMode === 'login' ? t('noAccount') : t('hasAccount')}
                    <button onClick={() => setCurrentMode(currentMode === 'login' ? 'signup' : 'login')}>
                        {currentMode === 'login' ? t('signup') : t('login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- Profile Modal Component ---
const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave, onLogout, t }) => {
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [avatar, setAvatar] = useState(user.avatar);
    const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || defaultCoverPhoto);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const avatarFileInputRef = useRef<HTMLInputElement>(null);
    const coverFileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.trim()) {
            setError(t('usernameEmpty'));
            return;
        }
        setIsLoading(true);
        try {
            await onSave(username, bio, avatar, coverPhoto);
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? t(err.message) : t('unknownError');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label={t('close')}>&times;</button>
                <h2>{t('editProfile')}</h2>
                <form onSubmit={handleSave}>
                    <div className="profile-modal-cover-container" onClick={() => coverFileInputRef.current?.click()}>
                        <img src={coverPhoto} alt="Cover" className="profile-modal-cover-photo" />
                        <div className="cover-photo-overlay">{t('changeCoverPhoto')}</div>
                         <input
                            ref={coverFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverPhotoChange}
                            style={{ display: 'none' }}
                            aria-label={t('changeCoverPhoto')}
                        />
                    </div>

                    <div className="profile-modal-avatar-container" onClick={() => avatarFileInputRef.current?.click()}>
                        <img src={avatar} alt="Profile avatar" className="profile-modal-avatar" />
                        <span>{t('changePicture')}</span>
                        <input
                            ref={avatarFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            aria-label={t('changePicture')}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">{t('username')}</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">{t('bio')}</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={t('bioPlaceholder')}
                            maxLength={150}
                        />
                         <small>{bio.length} / 150</small>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="profile-modal-actions">
                         <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : t('saveChanges')}
                        </button>
                        <button type="button" className="header-button" onClick={onLogout}>
                            {t('logout')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Post Component ---
const PostComponent: React.FC<PostComponentProps> = ({ post, currentUser, onLike, onComment, t }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        onComment(post.id, commentText);
        setCommentText('');
    };
    
    const categoryDetail = categoryDetails[post.category];

    return (
        <div className="post">
            <div className="post-header">
                <img src={post.avatar} alt={`${post.author}'s avatar`} className="avatar-img" />
                <span className="author">{post.author}</span>
            </div>
             <div className="post-meta">
                {categoryDetail && <span className="category-tag" style={{ backgroundColor: categoryDetail.color }}>{t(`category_${post.category}`)}</span>}
                {post.location && <span className="location-tag">📍 {post.location}</span>}
            </div>
            <p className="post-content">{post.content}</p>
            {post.isAI && <span className="ai-badge">{t('generatedByAI')}</span>}

            <div className="post-stats">
                <span>{post.likes} {t('likes')}</span>
                <span>{post.comments.length} {t('comments')}</span>
            </div>
            <div className="post-interactions">
                <button className="interaction-button" onClick={() => onLike(post.id)} aria-label={t('like')}>
                    👍 {t('like')}
                </button>
                <button className="interaction-button" onClick={() => setShowComments(!showComments)} aria-expanded={showComments} aria-label={t('comment')}>
                    💬 {t('comment')}
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                   {currentUser && (
                     <form className="comment-form" onSubmit={handleSubmitComment}>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={t('writeComment')}
                            aria-label={t('writeComment')}
                        />
                        <button type="submit" disabled={!commentText.trim()}>{t('send')}</button>
                    </form>
                   )}
                    <div className="comments-list">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <span className="comment-author">{comment.author}</span>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main App Component ---
const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('general');
  const [newPostLocation, setNewPostLocation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<PostCategory | 'all'>('all');

  const [error, setError] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'vi');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);
  
  const t = (key: string) => translations[language]?.[key] || key;

  const handleCreatePost = (isAI: boolean = false) => {
      if (!newPostContent.trim() || !currentUser) return;

      const newPost: Post = {
          id: Date.now(),
          author: currentUser.username,
          avatar: currentUser.avatar,
          content: newPostContent,
          isAI,
          likes: 0,
          comments: [],
          category: newPostCategory,
          location: newPostLocation,
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setNewPostLocation(null);
      setNewPostCategory('general');
  };

  const handleSignUp = async (username: string, password: string): Promise<void> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
        throw new Error('usernameExists');
    }
    const newUser: User = { username, password, avatar: defaultAvatar, bio: '', coverPhoto: defaultCoverPhoto };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userForSession = { username: newUser.username, avatar: newUser.avatar, bio: newUser.bio, coverPhoto: newUser.coverPhoto };
    setCurrentUser(userForSession);
    sessionStorage.setItem('currentUser', JSON.stringify(userForSession));
    setShowAuthModal(null);
  };

  const handleLogin = async (username: string, password: string): Promise<void> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        throw new Error('invalidCredentials');
    }
    const userForSession = { username: user.username, avatar: user.avatar, bio: user.bio || '', coverPhoto: user.coverPhoto || defaultCoverPhoto };
    setCurrentUser(userForSession);
    sessionStorage.setItem('currentUser', JSON.stringify(userForSession));
    setShowAuthModal(null);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      sessionStorage.removeItem('currentUser');
      setShowProfileModal(false);
  };

  const handleSaveProfile = async (newUsername: string, newBio: string, newAvatar: string, newCoverPhoto: string) => {
    if (!currentUser) return;

    const oldUsername = currentUser.username;
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (newUsername !== oldUsername && users.some(u => u.username === newUsername)) {
        throw new Error('usernameInUse');
    }

    const updatedPosts = posts.map(post => {
        const newPost = { ...post };
        if (newPost.author === oldUsername) {
            newPost.author = newUsername;
            newPost.avatar = newAvatar;
        }
        newPost.comments = newPost.comments.map(comment => {
            if (comment.author === oldUsername) {
                return { ...comment, author: newUsername };
            }
            return comment;
        });
        return newPost;
    });
    setPosts(updatedPosts);

    const userIndex = users.findIndex(u => u.username === oldUsername);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], username: newUsername, bio: newBio, avatar: newAvatar, coverPhoto: newCoverPhoto };
        localStorage.setItem('users', JSON.stringify(users));
    }

    const updatedUser = { username: newUsername, avatar: newAvatar, bio: newBio, coverPhoto: newCoverPhoto };
    setCurrentUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };
  
  const handleLike = (id: number) => {
    setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleComment = (id: number, text: string) => {
      if(!currentUser) return;
    const newComment: Comment = {
      id: Date.now(),
      author: currentUser.username,
      text,
    };
    setPosts(posts.map(post =>
      post.id === id ? { ...post, comments: [newComment, ...post.comments] } : post
    ));
  };
  
  const filteredPosts = posts.filter(post => activeFilter === 'all' || post.category === activeFilter);
  const filterKeys = ['all', ...Object.keys(categoryDetails)] as const;

  return (
    <div className="app-container">
      {showAuthModal && <AuthModal mode={showAuthModal} onClose={() => setShowAuthModal(null)} onLogin={handleLogin} onSignUp={handleSignUp} t={t} />}
      {showProfileModal && currentUser && <ProfileModal user={currentUser} onClose={() => setShowProfileModal(false)} onSave={handleSaveProfile} onLogout={handleLogout} t={t} />}

      <header className="header">
        <div className="header-left">
            <h1>Mạng xã hội thu nhỏ</h1>
            <select className="language-selector" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="es">🇪🇸 Español</option>
            </select>
        </div>
         {currentUser ? (
            <div className="profile-section">
                <div className="profile-picture-uploader" onClick={() => setShowProfileModal(true)}>
                    <img src={currentUser.avatar} alt="User avatar" className="header-avatar" />
                </div>
            </div>
        ) : (
            <div className="auth-buttons">
                <button className="header-button" onClick={() => setShowAuthModal('login')}>{t('login')}</button>
                <button className="header-button primary" onClick={() => setShowAuthModal('signup')}>{t('signup')}</button>
            </div>
        )}
      </header>

      <main className="main-content">
        {currentUser && (
            <div className="profile-header-card">
                <img src={currentUser.coverPhoto || defaultCoverPhoto} alt="Cover" className="profile-cover-photo" />
                <div className="profile-header-info">
                    <img src={currentUser.avatar} alt="Avatar" className="profile-header-avatar" onClick={() => setShowProfileModal(true)} />
                    <span className="profile-header-username">{currentUser.username}</span>
                </div>
            </div>
        )}

        <div className="create-post">
          <div className="category-selector">
              {(Object.keys(categoryDetails) as PostCategory[]).map(cat => (
                 <button 
                    key={cat} 
                    className={`category-button ${newPostCategory === cat ? 'active' : ''}`}
                    onClick={() => setNewPostCategory(cat)}
                    style={newPostCategory === cat ? { backgroundColor: categoryDetails[cat].color, color: 'white' } : {}}
                 >
                    {t(`category_${cat}`)}
                 </button>
              ))}
          </div>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={`${t(`placeholder_${newPostCategory}`)}${currentUser ? ', ' + currentUser.username : ''}?`}
            disabled={!currentUser}
          />

          <div className="post-actions">
            <button className="location-button" onClick={() => setNewPostLocation(newPostLocation ? null : 'Quận 1, TP.HCM')}>
                {newPostLocation ? `📍 ${newPostLocation}` : t('tagLocation')}
            </button>
            <button
              className="post-button"
              onClick={() => handleCreatePost()}
              disabled={!newPostContent.trim() || !currentUser}
            >
              {t('post')}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="feed-filter-bar">
            {filterKeys.map(filter => (
                 <button 
                    key={filter}
                    className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                 >
                    {filter === 'all' ? t('all') : t(`category_${filter as PostCategory}`)}
                 </button>
            ))}
        </div>

        <div className="feed">
          {filteredPosts.map(post => (
            <PostComponent key={post.id} post={post} currentUser={currentUser} onLike={handleLike} onComment={handleComment} t={t} />
          ))}
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);