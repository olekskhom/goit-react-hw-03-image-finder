import { Component } from 'react';
import { fetchImgs } from '../API/PixabayAPI';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import css from './App.module.css';

export class App extends Component {
  state = {
    gallery: [],
    searchQuery: '',
    page: 1,
    isLoader: false,
    showBtn: false,
  };

  handleSearch = searchQuery => {
    if (this.state.searchQuery === searchQuery) {
      return alert(
        `You are watching "${searchQuery}" category. Enter a different category`
      );
    }

    this.setState({ searchQuery, gallery: [], page: 1 });
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page, searchQuery } = this.state;

    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      try {
        this.setState({ isLoader: true });
        const { data } = await fetchImgs(page, searchQuery);
        if (data.hits.length === 0) {
          return Notify.failure('Sorry, but nothing found');
        }
        const hasImages = data.total > data.hits.length && data.total - page * 12 >= 0;

        this.setState(prevState => ({
          showBtn: hasImages,
          gallery: [...prevState.gallery, ...data.hits],
        }));
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoader: false });
      }
    }
  }

  handleClickButton = () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        showBtn: false,
      };
    });
  };

  render() {
    const { gallery, searchQuery, isLoader, showBtn } = this.state;
    // перевірка зображень
    const hasImages = gallery.length > 0; 

    return (
      <div className={css.container}>
        <Searchbar handleSearch={this.handleSearch} />

        {hasImages && (
          <ImageGallery gallery={gallery} alt={searchQuery} />
        )}

        {isLoader && <Loader />}

        {showBtn && (
          <Button onClick={this.handleClickButton} hasImages={hasImages} />
        )}
      </div>
    );
  }
}
