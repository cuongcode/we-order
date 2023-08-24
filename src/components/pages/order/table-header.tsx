export const TableHeader = () => {
  return (
    <div className="flex w-full items-center gap-1 text-xs font-semibold">
      <div className="w-2" />
      <div className="w-14">Name</div>
      <div className="grow">Drink</div>
      <div className="w-32">Notes/Topping</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
      <div className="w-16">Offered by</div>
      <div className="w-28">Transfer</div>
    </div>
  );
};
