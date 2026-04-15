import { Link } from 'react-router-dom';
import { Gamepad2, PenTool, Image, LayoutTemplate } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const { id, title, type, color, icon } = category;

  const IconComponent = () => {
    switch (icon) {
      case 'gamepad': return <Gamepad2 size={24} />;
      case 'pen': return <PenTool size={24} />;
      case 'image': return <Image size={24} />;
      default: return <LayoutTemplate size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'primary': return 'hover:border-primary shadow-[0_0_15px_rgba(59,130,246,0)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      case 'accent': return 'border-accent shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]';
      case 'purple': return 'hover:border-neonPurple shadow-[0_0_15px_rgba(139,92,246,0)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]';
      default: return 'hover:border-gray-500 hover:shadow-[0_0_20px_rgba(156,163,175,0.3)]';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'primary': return 'text-primary bg-primary/20';
      case 'accent': return 'text-accent bg-accent/20';
      case 'purple': return 'text-neonPurple bg-neonPurple/20';
      default: return 'text-gray-300 bg-gray-700/50';
    }
  };

  return (
    <Link 
      to={`/category/${id}`}
      className={`relative group bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between aspect-[4/3] overflow-hidden ${getBorderColor()}`}
    >
      <div className={`p-3 rounded-xl w-max ${getIconColor()} mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
        <IconComponent />
      </div>

      <div className="z-10">
        <h3 className="text-xl font-display font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-white to-gray-400">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-1 capitalize">{type}</p>
      </div>

      {/* Background glow effect */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </Link>
  );
};

export default CategoryCard;
