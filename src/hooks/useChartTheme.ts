import { chartTheme } from 'config/chartTheme'
import useTheme from 'hooks/useTheme'

export default function useChartTheme() {
  return chartTheme[useTheme().resolved]
}
