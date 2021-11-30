import utils from "@/domains/movie/utils";

export default function searchMovie(req, res) {
  const { query } = req;
  console.log(query);
  utils.search.getMovie(
    {
      query: 'young',
    },
    (response) => {
      res.status(200).json(response);
    },
    (err) => {
      res.status(200).json({ msg: err.message });
    }
  );
}
