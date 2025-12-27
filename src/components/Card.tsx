import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface ImageCardProps {
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

export function ImageCard({ image, title, description, tags, onClick, className = '' }: ImageCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-white/90 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
  className?: string;
}

export function IconCard({ icon, title, description, color = 'bg-[#1e40af]', className = '' }: IconCardProps) {
  return (
    <Card className={className}>
      <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </Card>
  );
}
