import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-black py-12 mx-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="relative w-[477px] h-[596px] mr-auto">
          <Image 
            src="/images/AboutUsImage.png"
            alt="About Us Image"
            width={477}
            height={596}
            className="object-cover"
          />
        </div>

        <div className="mt-8 md:mt-0 md:w-1/2 text-center text-white px-4">
          <h2 className="text-6xl font-bold mb-28">About Us</h2>
          <p className="text-lg">
            We are a web development agency that offers tailored solutions for website creation and optimization, with a focus on emerging technologies such as Web 3.0. We specialize in helping entrepreneurs and businesses transform their traditional websites into advanced platforms that accept cryptocurrency payments and take full advantage of the blockchain&apos;s potential. In addition, we offer WordPress website development services, as well as fully customized front-end and back-end solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
