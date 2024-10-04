import Testimonial from './Testimonial'

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
    return(
    <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-black py-12 px-4 pb-72 w-full overflow-hidden min-h-screen">
      <h2 className="text-center text-white text-5xl font-bold mb-20">
        What people are saying about us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
    )

    
}

export default PeopleComments;

