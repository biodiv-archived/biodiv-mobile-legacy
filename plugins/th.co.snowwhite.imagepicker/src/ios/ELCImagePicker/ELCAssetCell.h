//
//  AssetCell.h
//
//  Created by ELC on 2/15/11.
//  Copyright 2011 ELC Technologies. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ELCAssetTablePicker.h"

@interface ELCAssetCell : UITableViewCell

@property (nonatomic, weak) ELCAssetTablePicker *parent;

- (void)setAssets:(NSArray *)assets withDimension:(CGFloat)dimension withPadding:(int)padding;
- (void)toggleOverlays;

@end
