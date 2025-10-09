import Gun from 'gun';

const gun = Gun();

export const P2PTrade = () => {
  const tradeItem = (item) => gun.get('trades').put(item);
  return <button onClick={() => tradeItem({ name: 'Item', price: 50 })}>Trade P2P</button>;
};
