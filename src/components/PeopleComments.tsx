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
      className="flex justify-center items-center px-4 -mt-28 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen"
      style={{
        background: 'linear-gradient(90deg, #5232A1 50%, #000000 100%)',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl text-center font-extrabold mb-16">
          What people are saying about us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      

      <div className="absolute bottom-0 left-0 w-full h-32" style={{
        background: 'linear-gradient(180deg, rgba(4,4,4,0) 0%, rgba(4,4,4,1) 100%)',
      }}></div>
    </section>
  );
};

export default PeopleComments;