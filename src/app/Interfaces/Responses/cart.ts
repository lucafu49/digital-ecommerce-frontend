import { PackageCart } from "./package-cart"

export interface Cart {
    user : string
    packages : PackageCart[]
}
