export const TableHeader = () => {
  return (
    <div className="flex w-full items-center gap-2 text-xs font-semibold">
      <div className="w-4" />
      <div className="w-14">Name</div>
      <div className="grow">Drink</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
      <div className="w-36">Notes</div>
      <div className="w-14">Offer by</div>
      <div className="w-28">Transfer</div>
    </div>
  );
};
