import style from './Customer.module.css'
export function Customer({ nama, jabatan, pesan }) {
  return (
    <div className={`bg-background p-[8px] rounded-[8px] w-full md:w-[65%] duration-300 ${style.customer_card}`}>
      <div className="flex items-center gap-[10px] pb-3.5">
        <img
          className="w-[50px] h-[50px] rounded-lg shadow"
          src="/dummy-profile-pic.webp"
          alt='DummyPic'
        ></img>
        <div className="flex flex-col">
          <h2 className="font-medium text-md">{nama}</h2>
          <span className="text-sm text-highlight-dark opacity-75 italic select-none">
            {jabatan}
          </span>
        </div>
      </div>
      <p className="ml-2">{pesan}</p>
    </div>
  );
}
