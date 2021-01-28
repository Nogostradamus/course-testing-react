import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';
import MovieForm from '../components/movie-form';

global.fetch = require('jest-fetch-mock');

const empty_movie = {
  title: '',
  description: ''
}
const movie = {
  id: 3,
  title: 'This is my first movie',
  description: 'and this is longer description'
}

describe("MovieForm component", () => {

  test("should have form elements", () => {
      const { getByLabelText, getByRole } = render(<MovieForm movie={empty_movie} />);
      expect(getByLabelText(/title/i)).toBeTruthy();
      expect(getByLabelText(/description/i)).toBeTruthy();
      expect(getByRole('button', {name: /create/i})).toBeTruthy();
  });

  test("should diplay form elements with movie data", () => {
    const { getByLabelText, getByRole, debug } = render(<MovieForm movie={movie} />);
    //debug(getByLabelText(/title/i))

    expect(getByLabelText(/title/i).value).toBe(movie.title);
    expect(getByLabelText(/description/i).value).toBe(movie.description);
    expect(getByRole('button', {name: /update/i})).toBeTruthy();
});

test("shouldn't trigger API request when clicked on button on empty form", async () => {
    const udpatedMovie = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(movie));
    const { getByRole } = render(<MovieForm movie={empty_movie} udpatedMovie={udpatedMovie}/>);
    const submitButton = getByRole('button', {name: /create/i});
    fireEvent.click(submitButton);

    await wait ( ()=> {
      expect(udpatedMovie).toBeCalledTimes(0);
    })
  });

  test("shouldn trigger API call when clicked on new movie btn", async () => {
    const movieCreated = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(movie));
    const { getByRole } = render(<MovieForm movie={empty_movie} movieCreated={movieCreated}/>);
    const submitButton = getByRole('button', {name: /create/i});

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    fireEvent.change(titleInput, { target: { value: "Title1"}});
    fireEvent.change(descInput, { target: { value: "Description2"}});

    fireEvent.click(submitButton);

    await wait ( ()=> {
      //expect(movieCreated.mock.calls[0][0]).toStrictEqual(movie);
      expect(movieCreated).toBeCalledWith(movie);
    })
  });
});