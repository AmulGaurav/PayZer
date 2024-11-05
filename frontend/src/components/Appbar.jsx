const Appbar = ({ name }) => {
  return (
    <div className="shadow h-14 flex justify-between font-semibold">
      <div className="flex flex-col justify-center h-full ml-4">PayZer App</div>

      <div className="flex items-center mr-4">
        <div className="flex flex-col justify-center h-full mr-4">{name}</div>
        <div className="rounded-full h-11 w-11 bg-slate-200 flex justify-center">
          <div className="flex flex-col justify-center h-full text-lg">H</div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
