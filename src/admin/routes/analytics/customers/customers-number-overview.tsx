/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Heading } from "@medusajs/ui";
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomQuery } from "medusa-react"
import { DateRange } from "../utils/types";
import { PercentageComparison } from "../common/percentage-comparison";
import { IconComparison } from "../common/icon-comparison";

type AdminCustomersStatisticsQuery = {
  dateRangeFrom: number
  dateRangeTo: number,
  dateRangeFromCompareTo?: number,
  dateRangeToCompareTo?: number,
}

export type CustomersCountResponse = {
  analytics: {
    dateRangeFrom: number
    dateRangeTo: number,
    dateRangeFromCompareTo?: number,
    dateRangeToCompareTo?: number,
    current: string,
    previous: string
  }
}

export const CustomersNumber = ({dateRange, dateRangeCompareTo, compareEnabled} : {dateRange?: DateRange, dateRangeCompareTo?: DateRange, compareEnabled?: boolean}) => {
  const { data, isLoading } = useAdminCustomQuery<
  AdminCustomersStatisticsQuery,
  CustomersCountResponse
  >(
    `/customers-analytics/count`,
    [dateRange, dateRangeCompareTo],
    {
      dateRangeFrom: dateRange ? dateRange.from.getTime() : undefined,
      dateRangeTo: dateRange ? dateRange.to.getTime() : undefined,
      dateRangeFromCompareTo: dateRangeCompareTo ? dateRangeCompareTo.from.getTime() : undefined,
      dateRangeToCompareTo: dateRangeCompareTo ? dateRangeCompareTo.to.getTime() : undefined
    }
  )

  if (isLoading) {
    return <CircularProgress size={12}/>
  }

  if (data.analytics == undefined) {
    return <Heading level="h3">Cannot get customers</Heading>
  }
  return (
    <Grid container alignItems={'center'} spacing={2}>
      <Grid item>
        <Heading level="h1">
          {data.analytics.current}
        </Heading>
      </Grid>
      {compareEnabled && dateRangeCompareTo && 
      <Grid item>
        <Grid container alignItems={'center'}>
          <Grid item>
            <IconComparison current={parseInt(data.analytics.current)} previous={data.analytics.previous ? parseInt(data.analytics.previous) : undefined}/>
          </Grid>
          {data.analytics.previous !== undefined && <Grid item>
            <PercentageComparison current={data.analytics.current} label="" previous={data.analytics.previous}/>
          </Grid>}
        </Grid>
      </Grid>
      }
    </Grid>
  );
}