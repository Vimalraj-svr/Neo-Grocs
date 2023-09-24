import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useAuth } from "../AuthPages/useAuth";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import logo from "../HomePage/Headers/header.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "./Products.css";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const ProductCard = ({ product, cart, setCart }) => {
  const { id, title, price, description, images } = product;

  const addToCart = (product) => {
    // Add product to the cart state
    setCart([...cart, product]);

    // Save the updated cart state to local storage
    localStorage.setItem("cart", JSON.stringify([...cart, product]));

    toast.info(`${product.title} added to the cart 😉`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <Card
      className="product-card"
      sx={{
        background:
          "linear-gradient(to top, #eeeeee, #ebe6eb, #ecdde3, #eed5d5, #ebcec3, #ebcebb, #e8cfb4, #e2d0ae, #e8d4af, #edd8af, #f3ddb0, #f8e1b0)",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardMedia className="product-image" image={images[2]} title={title} children={<div></div>} />
      <CardContent className="product-details">
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className="product-title"
          sx={{ fontFamily: "sans-serif" }}
        >
          <strong>
            <u>{title}</u>
          </strong>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="product-description"
        >
          {description}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          className="product-price"
        >
          <span className="price">
            <strong>₹ {price} </strong>
          </span>
          <span className="head">
            {" "}
            M.R.P:<s>{price + 123}</s>
          </span>
          <span className="tail"> (84%off)</span>
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="product-rating">{generateStars(3)}</div>
          <Tooltip
            TransitionComponent={Zoom}
            placement="left-start"
            title="Add to cart"
          >
            <IconButton
              className="cart-icon2"
              onClick={() => addToCart(product)}
              sx={{ color: "black", marginTop: "21px" }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

const generateStars = (rating) => {
  const maxStars = 5;
  const starIcons = [];
  for (let i = 0; i < maxStars; i++) {
    if (i < rating) {
      starIcons.push(
        <span key={i} className="star-icon gold">
          &#9733;
        </span>
      );
    } else {
      starIcons.push(
        <span key={i} className="star-icon gold">
          &#9734;
        </span>
      );
    }
  }
  return starIcons;
};

const Products = () => {
  const [typedText, setTypedText] = useState("");
  const fullText =
    "\u00A0\u00A0\u00A0Your Grocery Delivery Partner . . . . . . . . . . ";
  const delay = 75;
  const [effVar, setEffVar] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showNoMatchCard, setShowNoMatchCard] = useState(false);
  const noMatchCardRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve cart data from local storage on component mount
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    fetch("https://api.escuelajs.co/api/v1/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    if (searchInput.trim() === "") {
      setFilteredProducts(products);
      setShowNoMatchCard(false);
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowNoMatchCard(filtered.length === 0);
    }

    if (filteredProducts.length > 0) {
      const firstMatchedProduct = document.querySelector(".product-card");
      if (firstMatchedProduct) {
        firstMatchedProduct.scrollIntoView({ behavior: "smooth" });
      }
    } else if (noMatchCardRef.current) {
      noMatchCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    setTimeout(() => {
      handleSearch();
    }, 1000);
  };

  const handleCartClick = () => {
    navigate("/cart-page");
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "black", height: "100px" }}
        >
          <Toolbar
            sx={{
              display: "flex",
              marginTop: "auto",
              marginBottom: "auto",
              alignItems: "center",
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src={logo} style={{ width: "120px" }} alt="Logo" />
            </Link>
            <Typography
              variant="h7"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "unset",
                color: "grey",
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <span className="head-title">{typedText}</span>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "#eeb03d" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for products..."
                inputProps={{ "aria-label": "search" }}
                onChange={handleInputChange}
                value={searchInput}
              />
            </Search>
            <Tooltip
              TransitionComponent={Zoom}
              placement="bottom"
              title="View cart"
            >
              <IconButton
                className="cart-icon"
                sx={{
                  backgroundColor: "#eeb03d",
                  borderRadius: "50%",
                  padding: "8px",
                  color: "black",
                }}
                onClick={handleCartClick}
              >
                <ShoppingCartIcon sx={{ fontSize: "24px" }} />
              </IconButton>
            </Tooltip>

            <Link to="/" style={{ textDecoration: "none" }}>
              <Button
                className="button"
                sx={{
                  color: "black",
                  backgroundColor: "#eeb03d",
                  marginLeft: "15px",
                }}
                onClick={() => {
                  logout();
                  toast.success("Signed Out successfully!!", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                  });
                }}
              >
                <ExitToAppIcon />
                <Typography variant="body2" sx={{ paddingLeft: "10px" }}>
                  Sign out
                </Typography>
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "fantasy",
          backgroundImage:
            "linear-gradient(to left bottom, #eeb03d, #c2763f, #874839, #452527, #000000)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "5px",
          marginTop: "20px",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add a shadow here
        }}
      >
        Our Products
      </Typography>
      <div className="centered-container">
        <div className="product-card-container">
          {filteredProducts
            .slice(1, filteredProducts.length - 1)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cart={cart}
                setCart={setCart}
              />
            ))}
        </div>
        {showNoMatchCard && (
           <Card
           ref={noMatchCardRef}
           className="product-card no-match-card"
           sx={{
             width: "100%",
             padding: "2rem",
             background: "linear-gradient(to right, rgba(238, 176, 61, 0.5), rgba(194, 118, 63, 0.5), rgba(135, 72, 57, 0.5), rgba(69, 37, 39, 0.5), rgba(0, 0, 0, 0.5))",
             color: "#fff",
             borderRadius: "8px",
             boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)", /* Increased box shadow */
             animation: "fadeIn 1s ease-in-out",
           }}
          >
           <CardContent>
             <Typography
               gutterBottom
               variant="h5"
               component="div"
               className="product-title"
               sx={{
                 fontFamily: "monospace",
                 fontSize: "24px", /* Increased text size */
                 textAlign: "center",
                 opacity: 0,
                 animation: "fadeInText 3s ease-in-out forwards",
                 textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", /* Added text shadow */
                 color: "black", /* Changed font color for contrast */
                 WebkitTextStroke: "0.5px black", /* Added glow effect */
               }}
             >
               No Items matched your Search !! 😔🔍
             </Typography>
           </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Products;
