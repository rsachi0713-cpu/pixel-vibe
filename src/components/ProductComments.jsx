import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { Send, Heart, Reply, Trash2, MessageSquare } from 'lucide-react';

const ProductComments = ({ productId, currentUser, isAdmin }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) fetchComments();
    }, [productId]);

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:user_id (full_name, avatar_url, status),
                comment_likes (user_id)
            `)
            .eq('product_id', productId)
            .order('created_at', { ascending: true });

        if (!error) setComments(data || []);
        setLoading(false);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        const { error } = await supabase
            .from('comments')
            .insert({
                user_id: currentUser.id,
                content: newComment,
                product_id: productId
            });

        if (error) {
            alert(`Error: ${error.message}. Did you run the SQL to add 'product_id'?`);
            console.error('Post error:', error);
        } else {
            setNewComment('');
            fetchComments();
        }
    };

    const handleLike = async (commentId, hasLiked) => {
        if (!currentUser) return;
        if (hasLiked) {
            await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', currentUser.id);
        } else {
            await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: currentUser.id });
        }
        fetchComments();
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return;
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (!error) fetchComments();
    };

    return (
        <div className="w-full bg-[#0a0a1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col h-full max-h-[400px]">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <MessageSquare size={16} className="text-cyan" />
                <h4 className="text-xs font-['Orbitron'] font-black tracking-widest uppercase">Design Feedback</h4>
                <span className="ml-auto text-[10px] text-gray-500 font-bold">{comments.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-4">
                {loading ? (
                    <div className="text-center py-4 text-[10px] uppercase tracking-widest text-gray-500">Syncing...</div>
                ) : comments.length > 0 ? (
                    comments.map(c => {
                        const hasLiked = c.comment_likes?.some(l => l.user_id === currentUser?.id);
                        return (
                            <div key={c.id} className="group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-black font-['Orbitron'] ${c.profiles?.status === 'admin' ? 'text-pink' : 'text-cyan'}`}>
                                        {c.profiles?.full_name || 'Creator'}
                                    </span>
                                    {(currentUser?.id === c.user_id || isAdmin) && (
                                        <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-pink transition-all">
                                            <Trash2 size={10} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-300 font-['Rajdhani'] leading-tight mb-2">{c.content}</p>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleLike(c.id, hasLiked)} className={`flex items-center gap-1 text-[9px] font-bold ${hasLiked ? 'text-pink' : 'text-gray-500'}`}>
                                        <Heart size={10} fill={hasLiked ? 'currentColor' : 'none'} /> {c.comment_likes?.length || 0}
                                    </button>
                                    <span className="text-[8px] text-gray-600 font-bold uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-600 italic text-xs">No feedback yet. Start the buzz!</div>
                )}
            </div>

            <form onSubmit={handlePost} className="relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser ? "Add your vibe..." : "Log in to comment"}
                    disabled={!currentUser}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan/50 transition-all font-['Rajdhani']"
                />
                <button 
                    type="submit" 
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan hover:text-white disabled:opacity-30 transition-colors"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};

export default ProductComments;
