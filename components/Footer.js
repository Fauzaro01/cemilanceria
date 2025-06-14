export default function Footer() {
    return (
        <div className="w-[85%] mx-auto my-8 border-highlight-dark border-t-5 flex md:flex-row flex-col-reverse justify-between gap-[20px] p-[15px]">
        <div className="w-fit ss:w-44 sm:w-fit flex flex-col gap-2 justify-between">
          <div className="flex gap-3 items-center">
            <img
              src="/logocireng.webp"
              className="w-fill select-none bg-highlight-dark rounded-[8px] w-[50px] md:w-[70px] h-[50px] md:h-[70px] p-1.5"
              alt="logocireng"
            />
            <div>
              <h1 className="text-lg md:text-2xl text-highlight font-bold">
                Cemilan Ceria
              </h1>
              <p className="text-xs md:text-sm text-highlight-dark">
                Snacks that bring happiness
              </p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-800">
            © 2025 Cemilan Ceria. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-[50%]">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-highlight-dark text-sm md:text-md mb-1">
              Connect With Us
            </h3>
            <a
              href="https://wa.me/6285692517903"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-whatsapp me-2"></i> WhatsApp
            </a>
            <a
              href="https://www.instagram.com/cemilanceeria/"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-instagram me-2"></i> Instagram
            </a>
            <a
              href="https://tiktok.com/@cemilanceeria"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-tiktok me-2"></i> TikTok
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-highlight-dark text-sm md:text-md mb-1">
              Discover More
            </h3>
            <a
              href="https://id.pinterest.com/cemilanceeria"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-pinterest me-2"></i> Pinterest
            </a>
            <a
              href="https://web.facebook.com/profile.php?id=61569962241014"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-facebook me-2"></i> Facebook
            </a>
            <a
              href="https://twitter.com/cemilan_ceria"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-twitter-x me-2"></i> Twitter/X
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-highlight-dark text-sm md:text-md mb-1">
              Other Platforms
            </h3>
            <a
              href="https://youtube.com/@cemilanceeria"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-youtube me-2"></i> YouTube
            </a>
            <a
              href="http://shopee.co.id/10tentsupp2"
              className="text-sm md:text-md font-medium text-highlight-dark p-1 rounded-md hover:bg-highlight-dark hover:text-background duration-300 flex items-center"
            >
              <i className="bi bi-bag-heart-fill me-2"></i> Shoope
            </a>
          </div>
        </div>
      </div>
    )
};