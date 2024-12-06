import { PackageCart } from "./package-cart"

export interface Cart {
    userId : string
    packages : PackageCart[]
}
