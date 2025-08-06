import React, { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import PropTypes from "prop-types";
import "./charList.scss";

class CharList extends Component {
  itemRefs = [];

  setRef = (ref, index) => {
    this.itemRefs[index] = ref;
  };

  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 0,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest(this.state.offset);
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    this.setState((prevState) => ({
      charList: [...prevState.charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: prevState.offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onKeyDown = (e, index, id) => {
    if (e.key === "Enter") {
      this.props.onCharSelected(id);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault(); // предотвращаем прокрутку страницы
      if (index < this.itemRefs.length - 1) {
        this.itemRefs[index + 1].focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) {
        this.itemRefs[index - 1].focus();
      }
    }
  };

  renderItems(arr) {
    this.itemRefs = [];

    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          className="char__item"
          key={item.id}
          tabIndex={0} // делает элемент доступным для фокуса с клавиатуры
          ref={(el) => this.setRef(el, i)}
          onClick={() => this.props.onCharSelected(item.id)}
          onKeyDown={(e) => this.onKeyDown(e, i, item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } =
      this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
