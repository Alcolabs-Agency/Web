import Testimonial from './Testimonial';

interface TestimonialData {
  name: string;
  location: string;
  text: string;
  imageUrl: string;
}

const PeopleComments = () => {
  const testimonialsData: TestimonialData[] = [
    {
      name: "Valentina Espinosa",
      location: "Rajasthan",
      text: "Alcolabs transformed our website, making it attractive and functional. We saw an immediate increase in traffic.",
      imageUrl: "/images/ValentinaPhoto.png",
    },
    {
      name: "Renato Villalobos",
      location: "Delhi",
      text: "Alcolabs UX/UI consulting improved our site navigation. More satisfied users and more conversions.",
      imageUrl: "/images/RenatoPhotos.png",
    },
    {
      name: "Camila Montenegro",
      location: "Rak",
      text: "Thanks to Alcolabs SEO optimization, our online visibility has grown. We now reach more customers.",
      imageUrl: "/images/CamilaPhoto.png",
    },
  ];

  return (
    <section
      className="relative py-20 px-0 pb-72"
      style={{
        background: `
          radial-gradient(circle at 10% 20%, rgba(48,0,82,0.7), transparent 60%),
          radial-gradient(circle at 40% 30%, rgba(48,0,82,0.4), transparent 80%),
          radial-gradient(circle at 50% 70%, rgba(48,0,82,0.3), transparent 90%),
          black
        `,
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-center text-white text-5xl font-bold mb-20">
          What people are saying about us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              location={testimonial.location}
              text={testimonial.text}
              imageUrl={testimonial.imageUrl}
            />
          ))}
        </div>
      </div>

      {/* Gradiente de transición para suavizar el final */}
      <div className="absolute bottom-0 left-0 w-full h-32" style={{
        background: 'linear-gradient(180deg, rgba(4,4,4,0) 0%, rgba(4,4,4,1) 100%)',
      }}></div>
    </section>
  );
};

export default PeopleComments;
