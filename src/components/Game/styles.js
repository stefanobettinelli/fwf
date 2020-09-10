import { makeStyles } from "@material-ui/core/styles";

export default makeStyles({
  cardRoot: {
    width: "100%",
  },
  imageRoot: {
    width: "318px",
    height: "180px",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    alignContent: "stretch",
  },
  buttonRoot: {
    borderRadius: "200px",
  },
  buttonNext: {
    backgroundColor: "#6FCF97 !important",
  },
  buttonNextAlone: {
    marginLeft: "auto",
  },
  buttonFinish: {
    backgroundColor: "#846fcf",
  },
});
