import { Fragment } from "react";
import fs from "fs/promises";
import path from "path";
import exp from "constants";

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
};

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  // console.log(context);

  const { params } = context;
  const productId = params.productId;
  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  //   console.log("ids", ids);
  const pathsWithParams = ids.map((id) => {
    return { params: { productId: id } };
  });

  //   console.log("pathsWithParams", pathsWithParams);

  return {
    paths: pathsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;
