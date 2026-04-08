import AnimatedList from "../../components/AnimatedList"
import "../../components/AnimatedList.css"

const items = [
  "Button Component",
  "Modal Dialog",
  "Dropdown Menu",
  "Toast Notification",
  "Data Table",
  "Form Input",
  "Avatar Group",
  "Progress Bar",
]

export default function AnimatedListPreview() {
  return (
    <AnimatedList
      items={items}
      showGradients
      enableArrowNavigation
      displayScrollbar
    />
  )
}
