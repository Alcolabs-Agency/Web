import Image from 'next/image';

const AboutUs = () => {
  return (
    <section
      id="aboutus"
      className="pt-20 pb-72 mx-auto relative"
      style={{
        background: `
          linear-gradient(90deg, rgba(4,4,4,1) 70%, rgba(48,0,82,1) 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-32" style={{
        background: 'linear-gradient(0deg, rgba(4,4,4,0) 0%, rgba(4,4,4,1) 100%)',
      }}></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10">
        <div className="relative w-[477px] h-[596px] mr-auto">
          <Image 
            src="/images/AboutUsImg.png"
            alt="About Us Image"
            width={477}
            height={596}
            className="object-cover"
          />
        </div>

        <div className="mt-8 md:mt-0 md:w-1/2 text-center text-white px-4">
          <h2 className="text-6xl mb-28 font-SFbold">About Us</h2>
          <p className="text-lg font-SFregular text-justify">
            We are a web development agency that offers tailored solutions for website creation and optimization, with a focus on emerging technologies such as Web 3.0. We specialize in helping entrepreneurs and businesses transform their traditional websites into advanced platforms that accept cryptocurrency payments and take full advantage of the blockchain&apos;s potential. In addition, we offer WordPress website development services, as well as fully customized front-end and back-end solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
