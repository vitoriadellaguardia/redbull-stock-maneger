import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ListTable } from "../components/table";

interface Drink {
  name: string;
  type: string;
  price: number;
  volume: string;
}

const drinksData: Drink[] = [
  { name: "Coca-Cola", type: "Refrigerante", price: 6.5, volume: "350ml" },
  { name: "Pepsi", type: "Refrigerante", price: 5.9, volume: "350ml" },
  { name: "Suco de Laranja", type: "Suco Natural", price: 8.0, volume: "300ml" },
  { name: "Água Mineral", type: "Água", price: 3.5, volume: "500ml" },
  { name: "Cerveja Heineken", type: "Cerveja", price: 9.9, volume: "330ml" },
  { name: "Chá Gelado", type: "Chá", price: 7.5, volume: "300ml" },
  { name: "Café Expresso", type: "Café", price: 4.5, volume: "50ml" },
  { name: "Milkshake", type: "Sobremesa Líquida", price: 12.0, volume: "400ml" },
];

const columns: ColumnDef<Drink, string>[] = [
  {
    accessorKey: "name",
    header: "Bebida",
    meta: { filterLabel: "Nome da Bebida" },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    meta: { filterLabel: "Tipo de Bebida" },
  },
  {
    accessorKey: "volume",
    header: "Volume",
  },
  {
    accessorKey: "price",
    header: "Preço (R$)",
    cell: ({ getValue }) =>
      Number(getValue()).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  },
];

export default function DrinksTableExample() {
  return (
    <ListTable<Drink>
      data={drinksData}
      columns={columns}
      titleContent={<h2 className="text-lg font-bold">Lista de Bebidas</h2>}
    />
  );
}
