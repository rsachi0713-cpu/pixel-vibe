import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, MessageSquare, Reply, Trash2, User } from 'lucide-react';
import { supabase } from '../supabase/config';

const Community = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null); // { id, name }
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchComments();
    }, []);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profile);
        }
    };

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Fetch comments with profiles and likes count
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles:user_id (full_name, avatar_url, status),
                    comment_likes (user_id)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    user_id: user.id,
                    content: newComment,
                    parent_id: replyTo ? replyTo.id : null
                });

            if (error) throw error;

            setNewComment('');
            setReplyTo(null);
            fetchComments();
        } catch (error) {
            alert(`Error: ${error.message || 'Could not post comment'}. Please ensure you have run the SQL script in your Supabase SQL Editor.`);
            console.error(error);
        }
    };

    const handleLike = async (commentId, alreadyLiked) => {
        if (!user) return;

        try {
            if (alreadyLiked) {
                await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user.id);
            } else {
                await supabase
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: user.id
                    });
            }
            fetchComments();
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);

            if (error) throw error;
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const isAdmin = profile?.status === 'admin';

    // Organize comments into threads
    const rootComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId).reverse();

    const CommentRender = ({ comment, isReply = false }) => {
        const hasLiked = comment.comment_likes?.some(l => l.user_id === user?.id);
        const likesCount = comment.comment_likes?.length || 0;
        const replies = getReplies(comment.id);

        return (
            <div className={`flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] ${isReply ? 'ml-8 md:ml-12 mt-2 bg-transparent border-l-2 border-l-cyan/30' : 'mb-4'}`}>
                <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border ${comment.profiles?.status === 'pro' ? 'border-yellow-500/50' : 'border-white/10'}`} style={{
                        background: comment.profiles?.status === 'pro' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'linear-gradient(135deg, #00f5d4, #00bbff)'
                    }}>
                        {comment.profiles?.avatar_url ? (
                            <img src={comment.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-black font-black text-xs">{(comment.profiles?.full_name || 'U')[0].toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`text-sm font-black font-['Orbitron'] tracking-tighter uppercase ${comment.profiles?.status === 'pro' ? 'text-yellow-400' : 'text-cyan'}`}>
                                {comment.profiles?.full_name || 'Anonymous'}
                                {comment.profiles?.status === 'pro' && <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/20">PRO</span>}
                            </span>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                {new Date(comment.created_at).toLocaleDateString()} • {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        {(user?.id === comment.user_id || isAdmin) && (
                            <button onClick={() => handleDelete(comment.id)} className="text-gray-500 hover:text-pink transition-colors">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed font-['Rajdhani'] font-medium">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-6 mt-3">
                        <button 
                            onClick={() => handleLike(comment.id, hasLiked)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all ${hasLiked ? 'text-pink' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
                            <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                        </button>
                        
                        {!isReply && (
                            <button 
                                onClick={() => {
                                    setReplyTo({ id: comment.id, name: comment.profiles?.full_name });
                                    document.getElementById('comment-input').focus();
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-cyan transition-all"
                            >
                                <Reply size={14} />
                                <span>Reply</span>
                            </button>
                        )}
                    </div>

                    {/* Render Replies */}
                    {replies.length > 0 && (
                        <div className="pt-2">
                            {replies.map(reply => (
                                <CommentRender key={reply.id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white">
            {/* Header */}
            <div className="fixed top-0 inset-x-0 z-[1000] bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all font-['Rajdhani'] font-bold text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex flex-col items-end">
                        <h1 className="text-xl md:text-2xl font-['Orbitron'] font-black tracking-widest">COMMUNITY <span className="text-cyan">FEEDBACK</span></h1>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[4px]">Direct Creator Engagement</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto pt-28 pb-12 px-4">
                {/* Community Rules / Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-cyan text-xl font-black font-['Orbitron']">{comments.length}</div>
                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total Reviews</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-pink text-xl font-black font-['Orbitron']">{comments.reduce((acc, curr) => acc + (curr.comment_likes?.length || 0), 0)}</div>
                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total Likes</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-purple text-xl font-black font-['Orbitron']">100%</div>
                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Active Buzz</div>
                    </div>
                </div>

                {/* Post Comment Section */}
                <div className="mb-12 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan/20 to-purple/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-[#0d0d22] border border-white/10 rounded-3xl p-6 shadow-2xl">
                        {replyTo && (
                            <div className="flex justify-between items-center mb-4 px-4 py-2 bg-cyan/10 rounded-xl border border-cyan/20">
                                <span className="text-xs font-bold text-cyan">Replying to <span className="uppercase">{replyTo.name}</span></span>
                                <button onClick={() => setReplyTo(null)} className="text-cyan hover:text-white"><X size={14} /></button>
                            </div>
                        )}
                        <form onSubmit={handlePostComment} className="flex flex-col gap-4">
                            <textarea
                                id="comment-input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={user ? "Write your feedback or ideas..." : "Please log in to post a comment"}
                                disabled={!user}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-['Rajdhani'] font-medium tracking-wide focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all min-h-[120px] resize-none"
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <User size={12} />
                                    {user ? `Logged in as ${profile?.full_name || user.email}` : 'Join the conversation'}
                                </div>
                                <button
                                    type="submit"
                                    disabled={!user || !newComment.trim()}
                                    className="bg-gradient-to-r from-[#f72585] to-[#7209b7] hover:opacity-90 text-white px-8 py-3 rounded-xl font-['Orbitron'] font-black text-xs tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale shadow-[0_10px_30px_rgba(247,37,133,0.3)]"
                                >
                                    POST <Send size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                            <span className="text-gray-500 font-['Rajdhani'] font-bold tracking-widest uppercase">Syncing Community...</span>
                        </div>
                    ) : rootComments.length > 0 ? (
                        rootComments.map(comment => (
                            <CommentRender key={comment.id} comment={comment} />
                        ))
                    ) : (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                            <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-gray-500 font-['Orbitron'] font-black uppercase tracking-widest">No comments yet</h3>
                            <p className="text-gray-600 font-['Rajdhani'] text-sm mt-2 uppercase tracking-widest">Be the first to share your vibes!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
