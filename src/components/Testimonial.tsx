import Image from 'next/image';

interface TestimonialProps {
  name: string;
  location: string;
  text: string;
  imageUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, location, text, imageUrl }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
      <div className="ml-1 text-purple-900 font-semibold">★★★★★</div>
      <p className="text-gray-700 text-base pt-5">&ldquo;{text}&ldquo;</p>
      <div className="flex items-center mt-4 pt-5">
        <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 mr-4">
            <Image 
                src={imageUrl} 
                alt={name} 
                fill
                className="rounded-full object-cover" 
                sizes="48px"
            />
            </div>
            <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-gray-500 hidden md:block">{location}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
